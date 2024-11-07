<template>
  <transition name="el-zoom-in-center">
    <div>
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建销售订单' : btnType == 'edit' ? '编辑销售订单' : btnType == 'look' ? '查看销售订单' : '新建销售订单'" />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('draft')">
              保存草稿</el-button>
            <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading" :element-loading-text="loadingText">

          <el-tabs v-model="activeName" @tab-click="handleClick" v-if="!approvalFlag">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="订单编号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入订单编号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="订单类型" prop="orderType">
                          <el-select v-model="dataForm.orderType" placeholder="请选择订单类型" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="所属客户" prop="cooperativePartnerId">
                          <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择所属客户" readonly
                            @focus="openDialog" :disabled="btnType == 'look' ? true : false">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="所属部门" prop="departmentId">
                          <ComSelect v-model="organizeIdTrees" :disabled="isdisabled" placeholder="请选择所属部门" auth
                            @change="onOrganizeChangeHandle" :currOrgId="dataForm.departmentId || '0'" />
                        </el-form-item>

                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="所属销售" prop="salesName">
                          <el-select v-model="dataForm.salesName" placeholder="请选择所属销售人员" style="width: 100%;"
                            :disabled="salesFlag" filterable @change="selectsales">
                            <el-option v-for="(item, index) in salesList" :key="index" :label="item.name"
                              :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>



                      <el-col :sm="6" :xs="24">
                        <el-form-item label="订单日期" prop="orderDate">
                          <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择订单日期"
                            :disabled="btnType == 'look' ? true : false">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="交货日期" prop="deliveryDate">
                          <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                            style="width: 100%;" placeholder="请选择交货日期" :disabled="btnType == 'look' ? true : false"
                            @change="changDateFun">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                        <el-form-item label="订单状态" prop="orderState">
                          <el-select v-model="dataForm.orderState" placeholder="请选择订单状态" style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false">
                            <el-option v-for="item in orderStateList" size="small" :key="item.id" :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                        <el-form-item label="含税总金额" prop="totalAmount">
                          <el-input v-model="dataForm.totalAmount" placeholder="请输入含税总金额"
                            :disabled="btnType == 'look' ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                        <el-form-item label="不含税总金额" prop="excludingTaxTotalAmount">
                          <el-input v-model="dataForm.excludingTaxTotalAmount" placeholder="请输入不含税总金额"
                            :disabled="btnType == 'look' ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                        <el-form-item label="税额" prop="taxAmount">
                          <el-input v-model="dataForm.taxAmount" placeholder="请输入税额"
                            :disabled="btnType == 'look' ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注"
                            :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>



                <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
                  <div v-if="btnType !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:5px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceCustomerProductDialog()">选择客户产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="importProductFun()"
                      v-if="dataForm.orderType == 'normal' || dataForm.orderType == 'urgent'">导入产品 </el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDelete">批量删除</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-plus"
                      @click="addLinFun">新增一行</el-button>
                  </div>
                  <div style="height:530px;display:flex;" ref="boxresiz" v-if="btnType == 'look'">

                    <el-table ref="product" :data="productData" :fixedNO="false" border height="100%" :key="191"
                      style="width: 100%;height:100%">

                      <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                      <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">
                      </el-table-column>
                      <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                      </el-table-column>
                      <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                      <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                      <el-table-column prop="num" label="数量" width="100" :key="7">
                      </el-table-column>
                      <el-table-column prop="price" label="单价(含税)" width="120" :key="11">
                      </el-table-column>
                      <el-table-column prop="taxRate" label="税率" width="120" :key="171">
                        <template slot-scope="scope">
                          <div>{{ scope.row.taxRate }}%</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140"></el-table-column>
                      <el-table-column prop="totalAmount" label="金额(含税)" width="120" :key="125"></el-table-column>
                      <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" :key="126">
                        <template slot-scope="scope">
                          <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="deliveryDate" label="交货日期" width="180" :key="131"></el-table-column>
                      <el-table-column prop="contractNo" label="合同号" width="180" :key="132"></el-table-column>
                      <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">
                      </el-table-column>
                      <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">
                      </el-table-column>
                      <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                      </el-table-column>
                      <el-table-column prop="oil" label="油脂" width="120" :key="61">
                      </el-table-column>
                      <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">
                      </el-table-column>
                      <el-table-column prop="clearance" label="游隙" width="120" :key="100">
                      </el-table-column>
                      <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101"> </el-table-column>
                      <el-table-column prop="specialRequire" label="特殊要求" width="120" :key="1012"></el-table-column>
                      <el-table-column prop="remark" label="备注" width="200" :key="128">

                      </el-table-column>


                    </el-table>

                  </div>
                  <el-table ref="product" v-else :data="productData" :fixedNO="true"
                    @selection-change="handeleProductInfoData" border height="460" @row-click="rowclick" :key="165"
                    style="width: 100%;">
                    <el-table-column type="selection" width="55" fixed="left" :key="2">
                    </el-table-column>
                    <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                    <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">

                      <template slot-scope="scope">
                        <el-input v-model="scope.row.customerProductNo" placeholder="请输入"
                          @keyup.enter.native="searchCustomerProduct(scope)">{{
                            scope.row.customerProductNo }}
                        </el-input>
                      </template>
                    </el-table-column>

                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                      <template slot="header">
                        <span class="required">*</span>品名规格
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.drawingNo" placeholder="请输入"
                          @keyup.enter.native="searchDrawingNoProduct(scope.row, scope.$index)">{{
                            scope.row.drawingNo }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                    <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />
                    <!-- <el-table-column prop="availableQuantity" label="可用库存" width="100" :key="121">
                      <template slot-scope="scope">
                        <div> {{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}</div>

                      </template>
                    </el-table-column> -->

                    <el-table-column prop="num" label="数量" width="100" :key="7">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.num" :disabled="btnType == 'look' ? true : false"
                          @input="watchNum(scope.row, scope.$index)" placeholder="请输入"
                          @blur="checkNum(scope.row, scope.$index)">{{
                            scope.row.num }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价(含税)" width="120" :key="110">
                      <template slot="header">
                        <span class="required">*</span>单价(含税)
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.price" :disabled="btnType == 'look' ? true : false"
                          @input="watchPrice(scope.row, scope.$index)" placeholder="请输入"
                          @blur="checkPrice(scope.row, scope.$index)">{{
                            scope.row.price }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxRate" label="税率" width="120" :key="171">
                      <template slot="header">
                        <span class="required">*</span>税率
                      </template>
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;"
                          @change="changeTaxRate(scope.row, scope.$index)">
                          <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.fullName"
                            :value="item.taxRate"></el-option>
                        </el-select>
                      </template>

                    </el-table-column>
                    <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140"></el-table-column>

                    <el-table-column prop="totalAmount" label="金额(含税)" width="120" :key="125"></el-table-column>
                    <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" :key="126">
                      <template slot-scope="scope">
                        <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="deliveryDate" label="交货日期" width="180" :key="13">
                      <template slot="header">
                        <span class="required">*</span>交货日期
                      </template>
                      <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择">
                        </el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column prop="contractNo" label="客户合同号" width="120" :key="116">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.contractNo">{{ scope.row.contractNo }} </el-input>
                      </template>
                    </el-table-column>

                    <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">
                      <!-- <template slot="header">
                        <span class="required">*</span>打字内容
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable
                          style="width: 100%;">
                          <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">
                      <!-- <template slot="header">
                        <span class="required">*</span>精度等级
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                          <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>

                    <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">
                      <!-- <template slot="header">
                        <span class="required">*</span>振动等级
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oil" label="油脂" width="120" :key="61">
                      <!-- <template slot="header">
                        <span class="required">*</span>油脂
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clearance" label="游隙" width="120" :key="100">
                      <!-- <template slot="header">
                        <span class="required">*</span>游隙
                      </template> -->
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column prop="specialRequire" label="特殊要求" width="120" :key="101">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable style="width: 100%;">
                          <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                            :value="item.name"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>

                    <el-table-column prop="remark" label="备注" width="200" :key="128">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入" maxlength="200" />
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" width="120" fixed="right" :key="15">
                      <template slot-scope="scope">

                        <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                    <span style="font-weight:500;margin-right:10px">总数量：{{ totalNum }}</span>
                    <!-- <span style="font-weight:500;margin-right:10px">总副数量：{{ totalAssistantNum }}</span> -->
                    <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ totalAmount }}</span>
                    <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ excludingTaxAmount }}</span>
                  </div>
                </el-collapse-item>

              </el-collapse>





            </el-tab-pane>

            <el-tab-pane label="附件" name="annex" v-if="isattachmentswitch == '1'">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
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
                    <el-form-item label="订单编号" prop="orderNo">
                      <el-input v-model="dataForm.orderNo" placeholder="请输入订单编号"
                        :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false"
                        maxlength="300" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="订单类型" prop="orderType">
                      <el-select v-model="dataForm.orderType" placeholder="请选择订单类型" clearable style="width: 100%;"
                        :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="(item, index) in orderList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="所属客户" prop="cooperativePartnerId">
                      <el-input v-model="dataForm.cooperativePartnerName" placeholder="请选择所属客户" readonly
                        @focus="openDialog" :disabled="btnType == 'look' ? true : false">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="所属部门" prop="departmentId">
                      <ComSelect v-model="organizeIdTrees" :disabled="isdisabled" placeholder="请选择所属部门" auth
                        @change="onOrganizeChangeHandle" :currOrgId="dataForm.departmentId || '0'" />
                    </el-form-item>

                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="所属销售" prop="salesName">
                      <el-select v-model="dataForm.salesName" placeholder="请选择所属销售人员" style="width: 100%;"
                        :disabled="salesFlag" filterable @change="selectsales">
                        <el-option v-for="(item, index) in salesList" :key="index" :label="item.name"
                          :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>



                  <el-col :sm="6" :xs="24">
                    <el-form-item label="订单日期" prop="orderDate">
                      <el-date-picker v-model="dataForm.orderDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择订单日期"
                        :disabled="btnType == 'look' ? true : false">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="6" :xs="24">
                    <el-form-item label="交货日期" prop="deliveryDate">
                      <el-date-picker v-model="dataForm.deliveryDate" type="date" value-format="yyyy-MM-dd"
                        style="width: 100%;" placeholder="请选择交货日期" :disabled="btnType == 'look' ? true : false"
                        @change="changDateFun">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>








                  <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="订单状态" prop="orderState">
                      <el-select v-model="dataForm.orderState" placeholder="请选择订单状态" style="width: 100%;"
                        :disabled="btnType == 'look' ? true : false">
                        <el-option v-for="item in orderStateList" size="small" :key="item.id" :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>


                  <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="含税总金额" prop="totalAmount">
                      <el-input v-model="dataForm.totalAmount" placeholder="请输入含税总金额"
                        :disabled="btnType == 'look' ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="不含税总金额" prop="excludingTaxTotalAmount">
                      <el-input v-model="dataForm.excludingTaxTotalAmount" placeholder="请输入不含税总金额"
                        :disabled="btnType == 'look' ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="税额" prop="taxAmount">
                      <el-input v-model="dataForm.taxAmount" placeholder="请输入税额"
                        :disabled="btnType == 'look' ? true : false" />
                    </el-form-item>
                  </el-col>


                  <el-col :sm="12" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注"
                        :disabled="btnType == 'look' ? true : false" type="textarea" :rows="2" maxlength="200" />
                    </el-form-item>
                  </el-col>
                </el-row>


              </el-form>
            </el-collapse-item>



            <el-collapse-item title="产品信息" name="productInfo" class="productInfo">
              <div v-if="btnType !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:5px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceCustomerProductDialog()">选择客户产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="importProductFun()"
                      v-if="dataForm.orderType == 'normal' || dataForm.orderType == 'urgent'">导入产品 </el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDelete">批量删除</el-button>|
                     
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-plus"
                      @click="addLinFun">新增一行</el-button>
                  </div>
              <div style="height:530px;display:flex;" ref="boxresiz" v-if="btnType == 'look'">

                <el-table ref="product" :data="productData" :fixedNO="false" border height="100%" :key="191"
                  style="width: 100%;height:100%">

                  <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                  <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">


                  </el-table-column>

                  <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">

                  </el-table-column>
                  <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                  <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />


                  <el-table-column prop="num" label="数量" width="100" :key="7">

                  </el-table-column>
                  <el-table-column prop="price" label="单价(含税)" width="120" :key="11">

                  </el-table-column>
                  <el-table-column prop="taxRate" label="税率" width="120" :key="171">

                    <template slot-scope="scope">
                      <div>{{ scope.row.taxRate }}%</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140"></el-table-column>

                  <el-table-column prop="totalAmount" label="金额(含税)" width="120" :key="125"></el-table-column>
                  <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" :key="126">
                    <template slot-scope="scope">
                      <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="deliveryDate" label="交货日期" width="180" :key="131"></el-table-column>
                  <el-table-column prop="contractNo" label="合同号" width="180" :key="132"></el-table-column>

                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">

                  </el-table-column>
                  <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">

                  </el-table-column>

                  <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">

                  </el-table-column>
                  <el-table-column prop="oil" label="油脂" width="120" :key="61">

                  </el-table-column>
                  <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">

                  </el-table-column>
                  <el-table-column prop="clearance" label="游隙" width="120" :key="100">

                  </el-table-column>
                  <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101"> </el-table-column>
                  <el-table-column prop="specialRequire" label="特殊要求" width="120" :key="1012"></el-table-column>

                  <el-table-column prop="remark" label="备注" width="200" :key="128">

                  </el-table-column>


                </el-table>

              </div>
              <el-table ref="product" v-else :data="productData" :fixedNO="true"
                @selection-change="handeleProductInfoData" border height="460" @row-click="rowclick" :key="165"
                style="width: 100%;">
                <el-table-column type="selection" width="55" fixed="left" :key="2">
                </el-table-column>
                <el-table-column type="index" width="60" label="序号" :key="10"></el-table-column>
                <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">

                  <template slot-scope="scope">
                    <el-input v-model="scope.row.customerProductNo" placeholder="请输入"
                      @keyup.enter.native="searchCustomerProduct(scope)">{{
                        scope.row.customerProductNo }}
                    </el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                  <template slot="header">
                    <span class="required">*</span>品名规格
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.drawingNo" placeholder="请输入"
                      @keyup.enter.native="searchDrawingNoProduct(scope.row, scope.$index)">{{
                        scope.row.drawingNo }}
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />


                <el-table-column prop="num" label="数量" width="100" :key="7">
                  <template slot="header">
                    <span class="required">*</span>数量
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.num" :disabled="btnType == 'look' ? true : false"
                      @input="watchNum(scope.row, scope.$index)" placeholder="请输入"
                      @blur="checkNum(scope.row, scope.$index)">{{
                        scope.row.num }}
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="单价(含税)" width="120" :key="110">
                  <template slot="header">
                    <span class="required">*</span>单价(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price" :disabled="btnType == 'look' ? true : false"
                      @input="watchPrice(scope.row, scope.$index)" placeholder="请输入"
                      @blur="checkPrice(scope.row, scope.$index)">{{
                        scope.row.price }}
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率" width="120" :key="171">
                  <template slot="header">
                    <span class="required">*</span>税率
                  </template>
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.taxRate" placeholder="请选择" style="width: 100%;"
                      @change="changeTaxRate(scope.row, scope.$index)">
                      <el-option v-for="(item, index) in taxRateList" :key="index" :label="item.enCode"
                        :value="item.taxRate"></el-option>
                    </el-select>
                  </template>

                </el-table-column>
                <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="140"></el-table-column>

                <el-table-column prop="totalAmount" label="金额(含税)" width="120" :key="125"></el-table-column>
                <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="140" :key="126">
                  <template slot-scope="scope">
                    <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" width="180" :key="13">
                  <template slot="header">
                    <span class="required">*</span>交货日期
                  </template>
                  <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                      :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="contractNo" label="客户合同号" width="120" :key="116">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.contractNo">{{ scope.row.contractNo }} </el-input>
                  </template>
                </el-table-column>

                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" :key="211">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.sealingCoverTyping" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" :key="123">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.accuracyLevel" placeholder="请选择" clearable>
                      <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column prop="vibrationLevel" label="振动等级" width="120" :key="17">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.vibrationLevel" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="oil" label="油脂" width="120" :key="61">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.oil" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="oilQuantity" label="油脂量" width="120" :key="51">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.oilQuantity" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="clearance" label="游隙" width="120" :key="100">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.clearance" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="packagingMethod" label="包装方式" width="120" :key="101">

                  <template slot-scope="scope">
                    <el-select v-model="scope.row.packagingMethod" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="specialRequire" label="特殊要求" width="120" :key="101">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.specialRequire" placeholder="请选择" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                        :value="item.name"></el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column prop="remark" label="备注" width="200" :key="128">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入" maxlength="200" />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="120" fixed="right" :key="15">
                  <template slot-scope="scope">

                    <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px;" class="text">
                <span style="font-weight:500;margin-right:10px">总数量：{{ totalNum }}</span>
                <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ totalAmount }}</span>
                <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ excludingTaxAmount }}</span>
              </div>
            </el-collapse-item>

          </el-collapse>

        </div>
        <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false"
          :visible.sync="customerVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="1200PX"
          append-to-body @close="handleClose">

          <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
            <div class="JNPF-common-layout-left">
              <div class="JNPF-common-title">
                <h2>客户分类</h2>
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
                <el-tree ref="treeBox" :data="treeData" :props="defaultProps" :default-expand-all="expands"
                  highlight-current :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick"
                  class="JNPF-common-el-tree" v-if="refreshTree" :filter-node-method="filterNode">
                  <!-- <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i
                    :class="[data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm']" />
                  <span class="text" :title="data.name">{{ data.name }}</span>
                </span> -->
                </el-tree>
              </el-scrollbar>
            </div>
            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.code" placeholder="客户编码" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.name" placeholder="客户名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.taxId" placeholder="税号" clearable />
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                      </el-button>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div class="JNPF-common-layout-main JNPF-flex-main">
                <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
                  <el-table-column prop="code" label="客户编码" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="客户名称" />
                  <el-table-column prop="taxId" label="税号" />
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="text" @click="seleceCustomer(scope.row)">选择</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize"
                  @pagination="initData" />
              </div>
            </div>
          </div>

        </el-dialog>

        <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
          :visible.sync="allProVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
          append-to-body>

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
                      <el-input v-model="ProductListRequestObj.productCode" placeholder="请输入产品编码" clearable />
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="ProductListRequestObj.productDrawingNo" placeholder="请输入品名规格" clearable />
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
                  <el-table-column prop="mainUnit" label="单位" />
                  <el-table-column prop="inventoryQuantity" label="库存数量" >
                    <template slot-scope="scope">
                      <el-link type="primary"
                        @click.native="viewFun(scope.row.id, 'inventoryFlag')">
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
        <ComSelect-page ref="comSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems"
          dialogTitle="选择产品" :listMethod="getcooperativeProduct" :listRequestObj="ProductListRequestObjs"
          :searchList="ProductTableSearchList" :elementShow="false" :multiple="true" :renderTree="false" />

        <changeAddress v-if="addressVisibled" ref="addressRef" @getChangeAddress="getChangeAddress"></changeAddress>

        <el-dialog title="导入数据" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
          :visible.sync="uploadVisib" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="400px">
          <el-upload cass="upload-demo" action="#" accept=".xls, .xlsx" :multiple="false" :auto-upload="false"
            :limit="1" :on-preview="handlePreview" drag :on-remove="handleRemove" :on-change="handleFileChange"
            ref="uploadRef">
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
      </div>
      <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
       <Form v-if="formVisible" ref="Form" ></Form>
    </div> 
  </transition>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable"
import "vue-draggable-resizable/dist/VueDraggableResizable.css"
// import productForm from "./productForm"
import { excelExport } from '@/api/basicData/index'
import { getDictionaryType, getDictionaryDataList } from '@/api/systemData/dictionary'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getcategoryTree as productTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import { getOrderDetail, addOrders, editOrders, getcategoryTrees, getAttributeline, getcooperativeProduct, getCopyOrders, getWorkOrderNo, uploadProduct, } from '@/api/salesManagement/assemblyOrders'
import { getCounryData, getCooperativeInfo, getCooperativeData, getscheduleList } from '@/api/basicData/index'
import { getProducts, getDetailByDrawNo } from '@/api/masterDataManagement/index.js' // 产品列表
import { getOrganization } from '@/api/permission/user'
import { getDepartmentSelectorByAuth } from "@/api/permission/department";
import ExportForm from '@/components/no_mount/ExportBox/index'
import {
  getProvinceList,
} from '@/api/system/province'
import { getbomOrderDetail } from '@/api/salesManagement/assemblyOrders'
import changeAddress from "./changeAddress.vue"
import { mapGetters, mapState } from 'vuex'
import { BillNumber } from '@/api/system/billRule'
import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow';
import recordList from '@/views/workFlow/components/RecordList.vue'
import { getBimBusinessDetail } from '@/api/basicData/index'
import Form from '@/views/warehouseManagement/finishedProductWarehouseManagement/inventory/Form.vue' 
export default {
  mixins: [busFlow],
  components: {
    changeAddress, VueDraggableResizable, ExportForm, Process, recordList,Form
  },
  data() {
    return {
      formVisible:false,
      isattachmentswitch: '',
      oldId: "",
      oldType: "",
      createdData: {
        customerProductNo: "",
        drawingNo: "",
        productCode: "",
        mainUnit: "",
        availableQuantity: "",
        num: "",
        deputyUnit: "",
        assistantNum: "",
        price: "",
        excludingTaxPrice: "",
        taxRate: "",
        totalAmount: "",
        excludingTaxAmount: "",
        deliveryDate: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        productsId: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        remark: "",
      },
      btnText: "",
      tipsvisible: false,
      uploadVisib: false,
      activeNames: ["productInfo", "basicInfo"],
      bomLoading: false,
      boxwidth: 0,
      dataFormTwo: {
        data: []
      },
      width1: 400,
      width: 700,
      height: 530,
      background: true,
      exportFormVisible: false,
      scheduleData: [],
      scheduleForm: {},
      scheduleForm1: {
        ordersId: '',
        productsName: '',
        productsCode: '',
        customerProductNo: '',
        customerProductDrawingNo: '',
        productsDrawingNo: '',
        orderItems: [{
          "asc": true,
          "column": ""
        }],
        pageNum: 1,
        pageSize: 20,
      },
      submitmethodsTitle: "",
      getProducts,
      getcooperativeProduct,
      // 选择产品 弹框列表展示字段
      loadingText: '',
      ProductTableItems: [
        { prop: 'customerProductNo', label: ' 客户料号', fixed: 'left' },
        { prop: 'productCode', label: '产品编码' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'mainUnit', label: '单位' },
      ],
      // 选择客户产品参数
      ProductListRequestObjs: {
        contractId: null,
        customerProductNo: "",
        productCode: "",
        productName: "",
        partnerId: "",
        productStatus: 'enable',
        partnerType: "customer",
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
      // 客户产品查询条件
      ProductTableSearchList: [
        { prop: "customerProductNo", label: "客户料号", type: 'input' },
        { prop: "drawingNo", label: "品名规格", type: 'input' },
        { prop: "productCode", label: "产品编码", type: 'input' },
      ],
      datafilelist: [],
      getDepartmentSelectorByAuth,
      addressVisibled: false,
      salesFlag: false,
      contractFlag: false,
      isdisabled: false,


      productVisible: false,
      cusPrototal: 0,//选择客户产品分页器的总条数


      organizeIdTrees: [],
      // 选择全部产品参数
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
      codeInfo: "",


      validateNumber: (rule, value, callback) => {
        const regex = /^\d{0,10}(\.\d{0,2})?$/; // 正则表达式，限制整数最多6位，小数最多4位
        if (!value || regex.test(value)) {
          callback(); // 验证通过
        } else {
          callback(new Error('请输入最多6位整数和最多4位小数')); // 验证失败
        }
      },

      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      index: null,
      expands: true,
      refreshTree: true,
      customerVisible: false,
      paymentMethodList: [],
      activeNameDetail: 'productInfo',


      standardFlagList: [
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      orderStateList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "部分完成", value: "part_finish" }
      ],



      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],

      btnType: undefined,
      bimVehicle: [],
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      salesList: [],
      activeName: "orderInfo",
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      createOrderType: 'normal',
      dataForm: {
        orderNo: "",
        orderType: "normal",
        orderCategory: "assembly",
        cooperativePartnerId: "",
        salesId: "",
        salesName: "",
        contractId: "",
        departmentId: "",
        workOrderNo: "",
        orderDate: "",
        deliveryDate: "",
        shipmentStatus: "",
        deliveryCompletionDate: "",
        shippingControl: "",
        delivery: "",
        deliveryNoteNumber: "",
        recipient: "",
        phone: "",
        country: "",
        province: "",
        city: "",
        area: "",
        address: "",
        orderState: "",
        paymentMethod: "",
        paymentCycle: "",
        // vehicleTypeCorrespondingId: "",
        // vehicleTypeCorrespondingName: "",
        changesCount: "",
        remark: "",
        id: "",
        cooperativePartnerName: "",
        departmentName: "",
        cooperativePartnerCode: "",
        approvalFlag: false,
      },
      codeConfig: {},//单据规则配置
      defaultAddress: "",
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      dataRule: {
        cooperativePartnerId: [
          { required: true, message: '所属客户不能为空', trigger: 'change' }
        ],
        orderType: [
          { required: true, message: '订单类型不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '部门不能为空', trigger: 'no' }

        ],
        salesName: [
          { required: true, message: '所属销售不能为空', trigger: 'change' }
        ],

        orderNo: [{ required: true, message: "请输入订单号", trigger: 'blur' }],
        orderDate: [{ required: true, message: '订单日期不能为空', trigger: 'change' }],
        deliveryDate: [{ required: true, message: '交货日期不能为空', trigger: 'change' }],
        // paymentMethod: [{ required: true, message: '付款方式不能为空', trigger: 'change' }],
        // paymentCycle: [{ required: true, message: '付款周期不能为空', trigger: 'change' }],
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      selectArr: [],
      createcontractId: "",
      createcontractName: "",
      customStyleData: 0,


      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      taxRateList: [],
      // productFormVisible: false
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false,   // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      attachmentData: {}
    }
  },
  computed: {
    totalNum: function () {
      var totalNums = 0;
      for (var i = 0; i < this.productData.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.productData[i].num])
      }
      return totalNums
    },
    totalAssistantNum: function () {
      var totalAssistantNums = 0;
      for (var i = 0; i < this.productData.length; i++) {
        totalAssistantNums = this.jnpf.math('add', [totalAssistantNums, this.productData[i].assistantNum])

      }
      return totalAssistantNums
    },
    totalAmount: function () {
      var totalAmounts = 0;
      for (var i = 0; i < this.productData.length; i++) {
        totalAmounts = this.jnpf.math('add', [totalAmounts, this.productData[i].totalAmount])
      }
      return totalAmounts
    },
    excludingTaxAmount: function () {
      var excludingTaxAmounts = 0;
      for (var i = 0; i < this.productData.length; i++) {
        excludingTaxAmounts = this.jnpf.math('add', [excludingTaxAmounts, this.productData[i].excludingTaxAmount])
      }
      return excludingTaxAmounts
    },
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),

  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    }
  },
  created() {
    // this.getProvinceList() 
  },
  mounted() {
    console.log("this.userInfo", this.userInfo);
    this.getBimBusinessDetail()
    this.dataForm.departmentId = this.userInfo.departmentId
    this.dataForm.salesName = this.userInfo.userName
    this.dataForm.salesId = this.userInfo.userId
    getOrganizeInfo(this.dataForm.departmentId).then(sss => {
      this.organizeIdTrees = sss.data.organizeIdTree || []
      this.organizeIdTrees.push(this.dataForm.departmentId)
      if (this.organizeIdTrees[0] == '-1') {
        this.organizeIdTrees.shift()
      }
    })
    getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
      console.log(66666);
      if (res.data.length > 0) {
        res.data.forEach(item => {
          this.$set(item, 'name', item.fullName.split('/')[0])
        });
      }
      console.log(res.data);
      this.salesList = res.data

    })

  },
  beforeDestroy() {
  },
  methods: {
    // 查看库存明细
    viewFun(id, type, warehouseId) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id, type, "",'product')
      })
    },
    addLinFun() {
      console.log(112);
      let index = this.productData.findIndex(item =>
        item.drawingNo === "" &&
        item.productsId === "" &&
        item.num === "" &&
        item.price === "" &&
        item.deliveryDate === ""
      )
      if (index !== -1) {
        console.log(6666);
        // 删除空行
        this.$message.error("已存在相同数据")
      } else {
        console.log("不存在");
        let obj = JSON.parse(JSON.stringify(this.createdData))
      this.productData.push(obj)
      }
      
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_sales'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.attachmentData = res.data
      })
    },
    searchDrawingNoProduct(data, idx) {
      console.log(data, idx);
      getDetailByDrawNo(data.drawingNo).then(res => {
        if (res.data) {
          res.data.productCode = res.data.code
          res.data.productsId = res.data.id
          this.$set(this.productData, idx, res.data)
          console.log(this.productData);
          let exists = this.taxRateList.some(item => item.taxRate === parseInt(res.data.taxRate));
          if (!exists && res.data.taxRate) {
            let obj = {
              taxRate: res.data.taxRate * 1,
              fullName: res.data.taxRate + '%',
              enCode: res.data.taxRate,
            }
            this.taxRateList.push(obj)
          }
        } else {
          this.$message.error("您输入的品名规格未匹配到对应的产品，请重新输入")
          this.$set(this.productData, idx, this.createdData)
        }


      })
    },
    // 按下enter键  根据输入的客户料号(客户物料号)查找客户产品
    searchCustomerProduct(data) {
      console.log("data", data);
      if (!this.dataForm.cooperativePartnerCode) return this.$message.error("请先选择客户")
      let index = data.$index
      let query = JSON.parse(JSON.stringify(this.ProductListRequestObjs))
      query.customerProductNo = data.row.customerProductNo
      query.partnerId = this.ProductListRequestObjs.parentId
      if (data.row.customerProductNo) {
        getcooperativeProduct(query).then(res => {
          // console.log("客户产品", res);
          console.log(777, this.productData);
          // this.productData.push(res.data.records[0])
          if (res.data.records.length) {
            res.data.records[0].taxRate = res.data.records[0].taxRate * 1
            this.$set(this.productData, index, res.data.records[0])
            let exists = this.taxRateList.some(item => item.taxRate === parseInt(res.data.records[0].taxRate));
            if (!exists && res.data.taxRate) {
              let obj = {
                taxRate: res.data.records[0].taxRate * 1,
                fullName: res.data.records[0].taxRate + '%',
                enCode: res.data.records[0].taxRate,
              }
              this.taxRateList.push(obj)
            }
          }

        })
      }
      let obj = JSON.parse(JSON.stringify(this.createdData))
      this.productData.push(obj)


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

      // 获取税率(数据字典)
      getbimProductAttributes("585438081021126405").then(res => {
        res.data.list.forEach(item => {
          item.taxRate = item.enCode.replace('%', '') * 1
        })
        this.taxRateList = res.data.list
        console.log("税率", this.taxRateList);
      })

    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },


    //多选
    handleRowClick(row) {
      this.$refs['dataTable'].$refs.JNPFTable.toggleRowSelection(row)
    },
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const TableFormTitle = mainRegion.querySelector('.TableForm_title') // 获取TableForm头部操作栏
      const TableFormTitleHeight = TableFormTitle ? TableFormTitle.clientHeight : 0
      let maxHeight = mainHeight - TableFormTitleHeight - 65 - 154
      maxHeight = maxHeight > 500 ? maxHeight : 500
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },
    // 表格选择交货日期
    selectDeliveryDate(row, index) {
      console.log(row);
      let arr = JSON.parse(JSON.stringify(this.productData))

      this.productData = arr
      console.log("this.productData", this.productData);
    },
    refresh() {
      this.productFormVisible = false
    },
    // 导出
    exportForm() {
      this.exportFormVisible = true
      let columnList = this.$refs.scheduleRef.columnList.filter(item => !!item.label && !!item.prop)
      columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
      this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
    },
    download(data) {
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        }
        let _data = {
          ...this.scheduleForm,
          exportType: '1105',
          exportName: '销售订单进度跟踪',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.scheduleForm.pageSize : -1
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },
    searchDetail() {
      this.formLoading = true
      this.scheduleForm.ordersId = this.dataForm.id
      Object.keys(this.scheduleForm).forEach(key => {
        let item = this.scheduleForm[key]
        this.scheduleForm[key] = typeof item === 'string' ? item.trim() : item
      })
      this.total = 0
      getscheduleList(this.scheduleForm).then(res => {
        this.scheduleData = res.data.records
        this.total = res.data.total
        this.formLoading = false
        this.visible = false
      }).catch(() => {
        this.visible = false
        this.formLoading = false
      })
    },
    resetDetail() {
      this.scheduleForm = JSON.parse(JSON.stringify(this.scheduleForm1))
      this.scheduleForm.pageNum = 1
      this.searchDetail()
    },


    // refresh () {
    //   this.productFormVisible = false
    // },
    rowclick(row) {
      if (this.btnType != "look") return
      this.bomLoading = true
      getbomOrderDetail(row.id).then(res => {
        this.bomLoading = false
        if (res.data.length) {
          res.data.map(element => {
            element.bomsleeve = element.sleeve.join('、')
            let a = []
            element.sheath.map(item => {
              item.code != 0 ? a.push(item.code) : ''
            })
            element.bomsheath = a.join('、')
          });
        }
        this.dataFormTwo.data = res.data
      }).catch(() => {
        this.bomLoading = false
      })
    },
    // 表单选择交货日期 表格批量覆盖
    changDateFun() {
      console.log("this.dataForm.deliveryDate", this.dataForm.deliveryDate);
      let arr = JSON.parse(JSON.stringify(this.productData))
      if (this.productData.length) {
        arr.forEach((item, index) => {
          // item.deliveryDate = this.dataForm.deliveryDate
          if (!item.deliveryDate) {
            this.$set(item, "deliveryDate", this.dataForm.deliveryDate)
          }
        });
        this.productData = arr
        console.log("this.productData", this.productData);
      }
    },
    cancelFun() {
      this.uploadVisib = false
      this.$refs['uploadRef'].clearFiles();
    },
    // 导入产品
    importProductFun() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error("请先选择客户")
      // 导入产品，获取数据渲染
      if (this.productData.length) {
        this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
          this.uploadVisib = true

          // this.$refs.UploadProduct.$el.querySelector('input').click()
        }).catch(() => { })
      } else {
        this.uploadVisib = true
      }
    },
    submit() {
      console.log(this.fileList);
      this.UploadProduct(this.file)
    },

    handleFileChange(file) {
      console.log("所选文件:", file);
      this.file = file.raw
    },

    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data)
      formData.append("partnerId", this.dataForm.cooperativePartnerId)
      //调用上传文件接口
      uploadProduct(formData).then(res => {
        if (!res.data.url) {
          this.$message.success(`导入成功`)
          if (res.data.list.length > 0) {
            res.data.list.forEach(item => {
              item.productCode = item.productsCode
              item.totalAmount = item.amounts
              item.excludingTaxAmount = item.excludingTaxAmounts
              if (this.dataForm.deliveryDate) {
                item.deliveryDate = this.dataForm.deliveryDate
              }
            });
          }
          this.productData = res.data.list
          this.formLoading = false
          this.loadingText = ''
          this.uploadVisib = false
        } else {
          this.handleMessage(res.data)
          this.$refs['uploadRef'].clearFiles();
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
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/销售订单导入模板.xlsx')
      a.click()
    },


    // 接收传递的地址
    getChangeAddress(data) {
      if (data) {
        this.dataForm.recipient = data.recipient
        this.dataForm.phone = data.phone
        this.dataForm.country = data.country === '中国' ? 'CN' : data.country
        this.dataForm.province = data.province
        this.dataForm.city = data.city
        this.dataForm.area = data.area
        this.dataForm.address = data.address
        if (this.dataForm.country === 'CN') {

          this.defaultAddress = data.countryText + data.provinceText + data.cityText + data.areaText + data.address
        } else {
          this.defaultAddress = data.countryText + data.address
        }
      }
    },
    // 更换地址
    changeAddress() {
      this.addressVisibled = true
      if (!this.dataForm.cooperativePartnerId) {
        this.$message.error('请先选择供应商')
      } else {
        this.$nextTick(() => {
          this.$refs.addressRef.initData(this.dataForm.cooperativePartnerId)
        })
      }
    },
    selectsales(val) {
      console.log(111, val);
      this.$nextTick(() => {
        this.$refs['dataForm'].validateField('salesName')

      })
      const data = this.salesList.find(item => item.id === val);
      console.log(data);
      this.dataForm.salesName = data.name
      this.dataForm.salesId = data.id

      // this.$forceUpdate()


    },


    onOrganizeChangeHandle(val) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      this.dataForm.salesName = ""
      this.dataForm.salesId = ""
      // this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.salesFlag = false

      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        console.log(66666);
        if (res.data.length > 0) {
          res.data.forEach(item => {
            this.$set(item, 'name', item.fullName.split('/')[0])
          });
        }
        console.log(res.data);
        this.salesList = res.data

      })
    },

    // 主数量输入失去焦点 检验不能为  0
    checkNum(row, index) {
      if (!row.num) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的数量",
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

    // 含税价格输入失去焦点 检验不能为  0
    checkPrice(row, index) {
      if (!row.price) {
        this.$message({
          message: "请填写第" + (index + 1) + "行产品的单价(含税)",
          type: 'error',
          duration: 1500,
        })
      } else if (Number(row.price) == 0) {
        this.$message({
          message: "第" + (index + 1) + "行产品的单价(含税)必须大于0",
          type: 'error',
          duration: 1500,
        })

      }
    },
    changeTaxRate(row, index) {
      console.log(row, index);
      let productArr = [...this.productData]
      productArr[index].excludingTaxPrice = this.jnpf.numberFormat(row.price / (1 + (row.taxRate * 1 / 100)), 2)
      productArr[index].excludingTaxAmount = this.jnpf.numberFormat((row.excludingTaxPrice * row.num), 2)
      this.productData = productArr
    },
    // 监听含税价格输入
    watchPrice(row, index) {
      // 计算方向calculationDirection 转换系数ratio  副数量assistantNum
      // 如果计算方向是乘 则副数量等于主数量*套数*转换系数
      // 如果计算方向是除 则副数量等于主数量*套数/转换系数
      // 使用正则表达式验证输入内容
      row.price = row.price.replace(/[^\d.]/g, '');
      let productArr = [...this.productData]

      if (row.price.length == 1 && row.price == '.') {
        // 如果第一位是小数点，则清空输入框
        row.price = '';
        row.assistantNum = '';
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
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 4) {
          arr[1] = arr[1].substring(0, 4)
        }
        row.price = arr[0] + '.' + arr[1]
      } else {
        if (row.price.length > 8) {
          row.price = row.price.substring(0, 8);
        }
      }
      productArr[index].excludingTaxPrice = this.jnpf.numberFormat(row.price / (1 + (row.taxRate * 1 / 100)), 2)
      productArr[index].excludingTaxAmount = this.jnpf.numberFormat((row.excludingTaxPrice * row.num), 2)
      productArr[index].totalAmount = this.jnpf.numberFormat((row.price * row.num), 2)

      this.productData = productArr
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
        row.assistantNum = '';
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
      console.log("index", index);
      console.log("row.num", row.num);
      if (row.calculationDirection == 'multiplication') {
        productArr[index].assistantNum = this.jnpf.numberFormat(row.num * row.ratio, 2)
        productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.price]), 2)
        productArr[index].excludingTaxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.excludingTaxPrice]), 2)
      } else {
        productArr[index].assistantNum = this.jnpf.numberFormat(row.num / row.ratio, 2)
        productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.price]), 2)
        productArr[index].excludingTaxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.excludingTaxPrice]), 2)
      }
      console.log("productArr", productArr);
      this.productData = productArr
    },



    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (this.selectRows.length < 1) return this.$message.error('请选择你要删除的数据')
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.productData.indexOf(row);
        if (index > -1) {
          this.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      this.productData.splice(data.$index, 1)
    },




    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct(val, data, paramsObj) {
      this.productVisible = false
      let arr = []
      let allArray = data.map(item => item.all);
      console.log("all", allArray);
      allArray.forEach(item => {
        item.taxRate = item.taxRate * 1
        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.price) / (1 + (Number(item.taxRate)) / 100), 2)

        } else {
          item.excludingTaxPrice = item.price
        }
        if (this.btnType == 'edit') {
          item.id = ""
        }
      });
      if (this.productData.length) {
        let index = this.productData.findIndex(item =>
          item.drawingNo === "" &&
          item.productsId === "" &&
          item.num === "" &&
          item.price === "" &&
          item.deliveryDate === ""
        )
        console.log(5555, index);
        if (index !== -1) {
          console.log(1212);
          // 使用 splice 插入 newDataArray
          this.productData.splice(index, 0, ...allArray);
        } else {
          this.productData = [...allArray, ...this.productData];
        }
      }
    },



    openSeleceCustomerProductDialog() {
      if (this.dataForm.cooperativePartnerId) {

        // this.productVisible = true
        // this.getcooperativeProduct()
        this.$refs["comSelect-page"].openDialog()
      } else {
        this.$message({
          message: "请先选择客户",
          type: 'error',
          duration: 1500,
        })
      }
    },
    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {

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
        item.taxRate = item.taxRate * 1
        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.salesPrice) / (1 + (Number(item.taxRate)) / 100), 2)

        } else {
          item.excludingTaxPrice = item.salesPrice
        }
      });
      if (this.productData.length) {
        let index = this.productData.findIndex(item =>
          item.drawingNo === "" &&
          item.productsId === "" &&
          item.num === "" &&
          item.price === "" &&
          item.deliveryDate === ""
        )
        if (index !== -1) {
          // 使用 splice 插入 newDataArray
          this.productData.splice(index, 0, ...this.selectArr);
        } else {
          this.productData = [...this.selectArr, ...this.productData,]
        }
      }

      // this.productData=[...this.productData,...this.selectArr]
    },


    handleClose() {
      this.form = {
        code: "",
        name: "",
        taxId: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.initData()
    },
    closeproductVisible() {

    },
    // 选择客户
    seleceCustomer(e) {
      console.log("e====>", e, this.productData);
      let arr = JSON.parse(JSON.stringify(this.productData))
      let index = arr.findIndex(item =>
        item.drawingNo === "" &&
        item.productsId === "" &&
        item.num === "" &&
        item.price === "" &&
        item.deliveryDate === ""
      )
      if (index !== -1) {
        console.log(6666);
        // 删除空行
        arr.splice(index, 1);
      }
      if (arr.length > 0) {
        this.$confirm('此操作将清空产品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false, // 防止点击遮罩层关闭
          closeOnPressEscape: false,// 防止按下Esc键关闭
          type: 'warning',
        }).then(() => {
          this.productData = []
          let obj = JSON.parse(JSON.stringify(this.createdData))
          this.productData.push(obj)
          getCooperativeInfo(e.id).then(res => {
            let addressInfo = {}
            if (res.data.deliveryAddressList.length > 0) {
              res.data.deliveryAddressList.forEach((item, index) => {
                if (item.defaultFlag) {
                  addressInfo = item
                  this.dataForm.recipient = addressInfo.recipient
                  this.dataForm.phone = addressInfo.phone
                  this.dataForm.country = addressInfo.country === '中国' ? 'CN' : addressInfo.country
                  if (this.dataForm.country === 'CN') {

                    this.dataForm.province = addressInfo.province
                    this.dataForm.city = addressInfo.city
                    this.dataForm.area = addressInfo.area
                    this.dataForm.address = addressInfo.address
                    this.defaultAddress = addressInfo.countryText + addressInfo.provinceText + addressInfo.cityText + addressInfo.areaText + addressInfo.address
                  } else {
                    this.dataForm.province = ''
                    this.dataForm.city = ''
                    this.dataForm.area = ''
                    this.defaultAddress = (addressInfo.countryText ? addressInfo.countryText : '') + addressInfo.address
                  }
                } else {
                  this.dataForm.recipient = res.data.deliveryAddressList[0].recipient
                  this.dataForm.phone = res.data.deliveryAddressList[0].phone
                  this.dataForm.country = res.data.deliveryAddressList[0].country === '中国' ? 'CN' : res.data.deliveryAddressList[0].country
                  if (this.dataForm.country === 'CN') {

                    this.dataForm.province = res.data.deliveryAddressList[0].province
                    this.dataForm.city = res.data.deliveryAddressList[0].city
                    this.dataForm.area = res.data.deliveryAddressList[0].area
                    this.dataForm.address = res.data.deliveryAddressList[0].address
                    this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].provinceText + res.data.deliveryAddressList[0].cityText + res.data.deliveryAddressList[0].areaText + res.data.deliveryAddressList[0].address
                  } else {
                    this.dataForm.province = ''
                    this.dataForm.city = ''
                    this.dataForm.area = ''
                    this.defaultAddress = (res.data.deliveryAddressList[0].countryText ? res.data.deliveryAddressList[0].countryText : '') + res.data.deliveryAddressList[0].address
                  }
                }
              });
            } else {
              this.dataForm.recipient = ""
              this.dataForm.phone = ""
              this.dataForm.country = ""
              this.dataForm.province = ""
              this.dataForm.city = ""
              this.dataForm.area = ""
              this.dataForm.address = ""
              this.defaultAddress = ""
            }

          })

        })
      }
      this.customerData = e
      this.dataForm.cooperativePartnerId = e.id
      console.log(56565656);
      this.ProductListRequestObjs.partnerId = e.id
      console.log("this.ProductListRequestObjs", this.ProductListRequestObjs);
      this.dataForm.cooperativePartnerName = e.name
      this.dataForm.cooperativePartnerCode = e.code

      this.dataForm.code = e.code
      this.customerVisible = false


      if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
        this.contractFlag = true
      } else {
        this.contractFlag = false

      }


      this.dataForm.paymentMethod = e.paymentMethod
      this.dataForm.paymentCycle = e.paymentCycle
      if (e.modeTransport == "SH") {
        this.dataForm.delivery = "deliver_goods"
      }
      if (e.modeTransport == "ZT") {
        this.dataForm.delivery = "self_pickup"
      }

      if (e.modeTransport == "KD") {
        this.dataForm.delivery = "express_delivery"
      }
      if (e.modeTransport == "HY") {
        this.dataForm.delivery = "freight_transport"
      }
      if (e.modeTransport == "DF") {
        this.dataForm.delivery = "collect_payment"
      }
    },

    changeCountry(e) {
      this.dataForm.country = e
    },
    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: "",
        taxId: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "customer",
      }
      this.getcategoryTree()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map(o => o.id)
      this.search()
    },
    getNodePath(node) {
      let fullPath = []
      const loop = (node) => {
        if (node.level) fullPath.unshift(node.data)
        if (node.parent) loop(node.parent)
      }
      loop(node)
      return fullPath
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
    // 获取客户数据
    getcategoryTree(isInit) {
      this.treeLoading = true
      let listQuery = {
        keyword: '',
        type: "customer"
      };
      getcategoryTrees(listQuery).then(res => {
        this.treeData = res.data
        this.$nextTick(() => {
          this.initData()
          this.treeLoading = false
        })
      }).catch(() => {
        this.treeLoading = false
      })
    },
    // 打开选择客户弹框
    openDialog() {
      this.customerVisible = true
      this.getcategoryTree()
    },
    // 切换table
    handleClick(tab, event) {
      console.log("tab", tab);
      if (tab.index == 0) {
        this.$nextTick(() => {
        })
      } else if (tab.name == "schedule") {
        this.switchStyleheight()
        this.scheduleForm = JSON.parse(JSON.stringify(this.scheduleForm1))
        this.resetDetail()
      }
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
      this.init('', 'add')

      this.tipsvisible = false
      this.btnLoading = false
    },
    init(id, btnType, approvalFlag) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.approvalFlag = approvalFlag
      this.oldId = JSON.parse(JSON.stringify(id)) || ""
      this.oldType = JSON.parse(JSON.stringify(btnType))
      if (this.dataForm.id) {
        if (btnType == "edit" || btnType == "look") {
          getOrderDetail(this.dataForm.id).then(res => {
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
            this.dataForm.country = res.data.order.country
            this.dataForm.province = res.data.order.province
            this.dataForm.city = res.data.order.city
            this.dataForm.area = res.data.order.area

            this.dataForm.address = res.data.order.address
            this.defaultAddress = res.data.order.region.countryName + res.data.order.region.provinceName + res.data.order.region.cityName + res.data.order.region.areaName + res.data.order.address
            this.$nextTick(() => {
              res.data.order.approvalStatus = ""
              this.dataForm = res.data.order
              if (this.btnType === 'edit') {
                this.getBusInfo()
              } else {
                // 流程信息和流转记录
                if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
              }
              if (!this.dataForm.cooperativePartnerId) {
                this.contractFlag = true
              } else {
                this.contractFlag = false

              }
              if (this.btnType == 'look') {
                this.contractFlag = true
                this.isdisabled = true
                this.salesFlag = true
                if (!res.data.orderLines.length) return
                this.rowclick(res.data.orderLines[0])
              }
              if (this.dataForm.departmentId) {
                if (this.btnType != 'look') {
                  this.salesFlag = false
                }
                getOrganizeInfo(this.dataForm.departmentId).then(sss => {
                  console.log(6854, res);
                  this.organizeIdTrees = sss.data.organizeIdTree || []
                  this.organizeIdTrees.push(this.dataForm.departmentId)
                })
                getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
                  console.log(9834, res);

                  this.salesList = res.data
                })
              } else {
                this.salesFlag = true
              }
              this.productData = res.data.orderLines
              if (btnType == 'add') {
                this.dataForm.deliveryDate = ""
                this.dataForm.orderDate = new Date();

              }
            })

          })
        } else {
          getOrderDetail(this.dataForm.id).then(res => {
            console.log("复制订单", res);
            this.dataForm.country = res.data.order.country
            this.dataForm.province = res.data.order.province
            this.dataForm.city = res.data.order.city
            this.dataForm.area = res.data.order.area
            this.datafilelist = []
            this.dataForm.address = res.data.order.address
            this.defaultAddress = res.data.order.region.countryName + res.data.order.region.provinceName + res.data.order.region.cityName + res.data.order.region.areaName + res.data.order.address
            res.data.order.approvalStatus = ""
            res.data.order.shipmentStatus = ""
            this.dataForm = res.data.order
            this.dataForm.orderNo = ""
            this.dataForm.distributeStatus = "undistributed"
            this.dataForm.planStatus = "not_generated"
            this.dataForm.orderState = "not_finish"
            this.dataForm.deliveryCompletionDate = ""
            this.dataForm.paymentMethod = res.data.order.paymentMethod
            this.dataForm.paymentCycle = res.data.order.paymentCycle
            if (!this.dataForm.cooperativePartnerId) {
              this.contractFlag = true
            } else {
              this.contractFlag = false
              this.ProductListRequestObjs.partnerId = this.dataForm.cooperativePartnerId
            }

            if (this.dataForm.departmentId) {
              if (this.btnType != 'look') {
                this.salesFlag = false
              }
              getOrganizeInfo(this.dataForm.departmentId).then(sss => {
                this.organizeIdTrees = sss.data.organizeIdTree || []
                this.organizeIdTrees.push(this.dataForm.departmentId)
              })
              getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(response => {
                if (response.data.length > 0) {
                  response.data.forEach(item => {
                    item.name = item.fullName.split('/')[0]
                  });
                }
                this.salesList = response.data
              })
            } else {
              this.salesFlag = true
            }
            this.productData = res.data.orderLines
            if (btnType == 'add') {
              this.dataForm.deliveryDate = ""
              this.dataForm.orderDate = new Date();

            }
            this.$refs.dataForm.resetFields()
            this.getBusInfo()
          })
        }


      } else {
        this.salesFlag = true

        this.dataForm = {
          orderNo: "",
          orderType: "normal",
          orderCategory: "assembly",
          cooperativePartnerId: "",
          contractId: "",
          workOrderNo: "",
          orderDate: "",
          deliveryDate: "",
          shipmentStatus: "",
          deliveryCompletionDate: "",
          shippingControl: "",
          delivery: "",
          deliveryNoteNumber: "",
          recipient: "",
          phone: "",
          country: "",
          province: "",
          city: "",
          area: "",
          address: "",
          orderState: "",
          paymentMethod: "",
          paymentCycle: "",
          // vehicleTypeCorrespondingId: "",
          // vehicleTypeCorrespondingName: "",
          changesCount: "",
          remark: "",
          id: "",
          cooperativePartnerName: "",
          departmentName: "",
          cooperativePartnerCode: "",
          approvalFlag: false,
          departmentId: "",
          salesName: "",
          salesId: "",
        },
          this.dataForm.departmentId = this.userInfo.departmentId
        this.dataForm.salesName = this.userInfo.userName
        this.dataForm.salesId = this.userInfo.userId
        this.productData = []
      }
      if (this.btnType == 'add' || this.btnType == 'copy') {
        setTimeout(() => {
          this.fetchData("SHDD", true)
        }, 500);
      }
      if (this.btnType == 'edit') {
        this.fetchData("SHDD", false)
      }
      if (btnType == 'add') {
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
        this.getBusInfo()
      }
      if (btnType != 'look') {
        let obj = JSON.parse(JSON.stringify(this.createdData))
        this.productData.push(obj)
        this.getProductClassFun()
      }





    },

    goBack() {
      this.$emit('close', true)
      this.tipsvisible = false
    },
    onOrganizeChange(val, data) {
      this.dataForm.partnerCategoryId = data ? data[0].id : ''
      this.dataForm.partnerCategoryIdText = data ? data[0].name : ''
    },
    extractSameKeys(obj1, obj2) {
      const newObj = {};
      for (let key in obj1) {
        if (obj2.hasOwnProperty(key)) {
          newObj[key] = obj2[key];
        }
      }
      return newObj;
    },

    handleConfirm(value) {
      console.log(this.dataForm);
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          let submitFlag = null;

          let f = {};


          this.dataForm.documentStatus = value
          this.dataForm.excludingTaxTotalAmount = this.excludingTaxAmount
          this.dataForm.totalAmount = this.totalAmount
          this.dataForm.taxAmount = this.jnpf.numberFormat(this.totalAmount - this.excludingTaxAmount, 2)
          if (this.datafilelist.length) {
            // this.datafilelist.map((item, index) => {
            //   item.bimAttachments = {
            //     businessType: '',
            //     documentId: item.id,
            //     fileFlag: '',
            //     sort: index
            //   }
            // })
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: "system_attachment",
                categoryId: this.attachmentData.configValue2,
                configKey: this.attachmentData.configKey,
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          let obj = {
            attachmentList: this.datafilelist,
            order: this.dataForm,
            orderLineList: [],
            flowData: this.flowData
          }
          let filteredArr = []
          if (this.productData.length < 1) {
            submitFlag = false
            this.$message({
              message: "请选择产品",
              type: 'error',
              duration: 1500,
            })
            return
          } else {
            let index = this.productData.findIndex(item =>
              item.drawingNo === "" &&
              item.productsId === "" &&
              item.num === "" &&
              item.price === "" &&
              item.deliveryDate === ""
            )
            if (index !== -1) {
              console.log(6666);
              // 删除空行
              this.productData.splice(index, 1);
            }
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.productsId) {
                submitFlag = false
                this.$message({
                  message: "第" + (index + 1) + "行产品不存在",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (!item.num && item.productsId) {
                submitFlag = false
                this.$message({
                  message: "请输入第" + (index + 1) + "行产品的数量",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (Number(item.num) == 0) {
                submitFlag = false
                this.$message({
                  message: "第" + (index + 1) + "行产品的数量必须大于0",
                  type: 'error',
                  duration: 1500,
                })
                break
              }

              if (!item.deliveryDate) {
                submitFlag = false
                this.$message({
                  message: "请选择第" + (index + 1) + "行产品的交货日期",
                  type: 'error',
                  duration: 1500,
                })
                break
              }
              if (value != 'draft') {
                if (!item.price) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的单价不能为空",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
                if (!item.drawingNo) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的品名规格不能为空",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
                if (!item.taxRate) {
                  submitFlag = false
                  this.$message({
                    message: "第" + (index + 1) + "行产品的税率不能为空",
                    type: 'error',
                    duration: 1500,
                  })
                  break
                }
                // if (!item.sealingCoverTyping) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的打字内容不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.accuracyLevel) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的精度等级不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.vibrationLevel) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的振动等级不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.oil) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的油脂不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.oilQuantity) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的油脂量不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.clearance) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的游隙不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }
                // if (!item.packagingMethod) {
                //   submitFlag = false
                //   this.$message({
                //     message: "第" + (index + 1) + "行产品的包装方式不能为空",
                //     type: 'error',
                //     duration: 1500,
                //   })
                //   break
                // }







              }



            }
            console.log("productData", this.productData);
            filteredArr = this.productData.filter(item => item.drawingNo && item.productsId);
            console.log("filteredArr", filteredArr);
            obj.orderLineList = filteredArr
          }
          setTimeout(() => {
            if (submitFlag === false) return
            this.btnLoading = true
            let formMethod = null;
            if (this.btnType == 'edit') {
              formMethod = editOrders
              this.btnText = "继续修改"
            } else if (this.btnType == 'add' || this.btnType == 'copy') {
              formMethod = addOrders
              this.btnText = "继续新增"
            }
            console.log("obj", obj);
            formMethod(obj).then(res => {
              let msg = "";
              if (value == "draft") {
                this.submitmethodsTitle = "保存成功"
              } else {
                this.submitmethodsTitle = "提交成功"

              }
              this.tipsvisible = true
              // this.$message({
              //   message: msg,
              //   type: 'success',
              //   duration: 1500,
              //   onClose: () => {
              //     this.visible = false
              //     this.btnLoading = false
              //     this.$emit('close', true)
              //   }
              // })
            }).catch(() => {
              this.btnLoading = false
            })
          }, 100);

        } else {
          this.btnLoading = false
        }
      })
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b025').then(res => {
        if (res.data) {
          if (res.data.enabledMark) {
            this.flowData = res.data
            this.flowTemplateJson = res.data.flowTemplateJson ? JSON.parse(res.data.flowTemplateJson) : null
            this.dataForm.approvalFlag = res.data.enabledMark
          } else {
            this.flowTemplateJson = {}
            this.dataForm.approvalFlag = false
            this.$message.error('未找到审批流程！')
          }
        } else {
          this.flowTemplateJson = {}
          this.dataForm.approvalFlag = false
        }
      }).catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id).then(res => {
        if (res.data) {
          this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson) : null
          this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
          this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
          let flowTaskNodeList = res.data.flowTaskNodeList
          if (flowTaskNodeList.length) {
            for (let i = 0; i < flowTaskNodeList.length; i++) {
              const nodeItem = flowTaskNodeList[i]
              const loop = data => {
                if (Array.isArray(data)) data.forEach(d => loop(d))
                if (data.nodeId === nodeItem.nodeCode) {
                  if (nodeItem.type == 0) data.state = 'state-past'
                  if (nodeItem.type == 1) data.state = 'state-curr'
                  if (nodeItem.nodeType === 'approver' || nodeItem.nodeType === 'start' || nodeItem.nodeType === 'subFlow') data.content = nodeItem.userName
                  return
                }
                if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                if (data.childNode) loop(data.childNode)
              }
              loop(this.flowTemplateJson)
            }
          }
        }
      }).catch(() => { })
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 5px
}



//.el-button--small {
// padding: 1;
//}</style>
::v-deep .el-tabs__content {
height: auto !important;
padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
padding: 9px 10px;
}
</style>
<style scoped lang="scss">
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

.el-table__footer {
  display: none;
}

::v-deep.has-gutter {
  display: none;
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

.productInfo ::v-deep.el-collapse-item__wrap {
  padding: 0;
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
</style>