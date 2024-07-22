<template>
  <transition name="el-zoom-in-center">
    <div>
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack"
            :content="btnType == 'add' ? '新建销售订单' : btnType == 'edit' ? '编辑销售订单' : btnType == 'look' ? '查看销售订单' : '新建销售订单'" />
          <div class="options" v-if="btnType != 'look'">
            <el-button type="success" size="mini" :loading="btnLoading" @click="handleConfirm('draft')">
              保存草稿</el-button>
            <el-button type="primary" size="mini" :loading="btnLoading" @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading" :element-loading-text="loadingText">

          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                  <!-- <div
                    style="line-height:33px;font-size:18px;border-top:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                    <h5>基本信息</h5>
                  </div> -->
                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="订单编号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" placeholder="请输入订单编号"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true ? false : true"
                            maxlength="300" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="订单类型" prop="orderType">
                          <el-select v-model="dataForm.orderType" placeholder="请选择订单类型" clearable style="width: 100%;"
                            :disabled="btnType == 'look' ? true : false" @change="changeOrderType">
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
                          <el-select v-model="dataForm.salesName" placeholder="请选择所属销售人员" clearable style="width: 100%;"
                            :disabled="salesFlag" filterable @change="selectsales">
                            <el-option v-for="(item, index) in salesList" :key="index" :label="item.name"
                              :value="item.id"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="工作令号" prop="workOrderNo">
                          <el-input v-model="dataForm.workOrderNo" placeholder="请输入工作令号" disabled maxlength="20" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="来源单号" prop="sourceOrderNo">
                          <el-input v-model="dataForm.sourceOrderNo" placeholder="请输入来源单号"
                            :disabled="btnType == 'look' ? true : false" maxlength="50" />
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
                        <el-form-item label="客户合同号" prop="contractNo">
                          <el-input v-model="dataForm.contractNo" placeholder="请输入客户合同号"
                            :disabled="btnType == 'look' ? true : false" maxlength="300" />

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
                        <el-form-item label="发货完成日期" prop="deliveryCompletionDate">
                          <el-date-picker v-model="dataForm.deliveryCompletionDate" type="date"
                            value-format="yyyy-MM-dd" :disabled="btnType == 'look' ? true : false" style="width: 100%;"
                            :picker-options="pickerOptions" placeholder="请选择发货完成日期">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>



                      <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                        <el-form-item label="发货单号" prop="deliveryNoteNumber">
                          <el-input v-model="dataForm.deliveryNoteNumber" placeholder="请输入发货单号"
                            :disabled="btnType == 'look' ? true : false" maxlength="300" />
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

                      <el-col :sm="6" :xs="24" v-if="btnType != 'look'">
                        <el-form-item label="套数" prop="coverNum">
                          <el-input v-model="coverNum" placeholder="请输入套数" :disabled="btnType == 'look' ? true : false"
                            maxlength="4" oninput="value = value.replace(/[^0-9]/g,'')">
                            <template slot="append">
                              <div v-if="btnType != 'look'" :key="Math.random()">
                                <el-button type="primary" :disabled="btnType == 'look' ? true : false"
                                  @click="computeWatch()">计算</el-button>
                              </div>
                              <div v-else :key="Math.random()">
                                <el-button type="info" plain :disabled="btnType == 'look' ? true : false">计算</el-button>

                              </div>
                            </template>

                          </el-input>
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

                      <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                        <el-form-item label="变更次数" prop="changesCount">
                          <el-input v-model="dataForm.changesCount" placeholder="请输入变更次数"
                            :disabled="btnType == 'look' ? true : false" maxlength="4" />
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
                <el-collapse-item title="产品信息" name="productInfo">
                  <!-- <div
                    style="line-height:33px;font-size:18px;border-top:1px solid #dcdfe6;background: #fafafa;padding-left:5px;"
                    ref="box">
                    <h5>产品信息</h5>
                  </div> -->
                  <div v-if="btnType !== 'look'">
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openSeleceProductDialog()">选择产品</el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="importProductFun()"
                      v-if="dataForm.orderType == 'normal' || dataForm.orderType == 'urgent'">导入产品 </el-button>|
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDelete">批量删除</el-button>

                  </div>
                  <div style="height:530px;display:flex;" ref="boxresiz" v-if="btnType == 'look'">
                    <vue-draggable-resizable :w="width || 1" :h="height" @resizing="handleResize" class-name="dragging1"
                      axis="y" :parent="true" :handles="['mr']">
                      <el-table ref="product" :data="productData" :fixedNO="true"
                        @selection-change="handeleProductInfoData" border height="100%" @row-click="rowclick" :key="1"
                        style="width: 100%;height:100%">
                        <el-table-column type="selection" width="55" fixed="left" v-if="btnType != 'look'" :key="2">
                        </el-table-column>
                        <el-table-column type="index" width="60" fixed="left" label="序号" :key="10">
                        </el-table-column>
                        <el-table-column prop="customerProductNo" label="客户物料号" width="150" :key="33" />
                        <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="150" :key="3">
                        </el-table-column>
                        <el-table-column prop="productCode" label="产品编码" width="200" :key="4" />
                        <el-table-column prop="productName" label="产品名称" width="200" :key="5">
                        </el-table-column>
                        <el-table-column prop="drawingNo" label="产品图号" min-width="220" :key="6" />
                        <el-table-column prop="availableQuantity" label="可用库存(主)" width="200" :key="121"
                          v-if="btnType != 'look'">
                          <template slot-scope="scope">
                            <div> {{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}</div>

                          </template>
                        </el-table-column>
                        <el-table-column prop="shipmentStatus" label="发货状态" width="120" :key="67">
                          <template slot-scope="scope">
                            <div v-if="scope.row.shipmentStatus == 'not_finish'"> <el-tag type="warning">未完成</el-tag>
                            </div>
                            <div v-else-if="scope.row.shipmentStatus == 'finish'"><el-tag type="success">已完成</el-tag>
                            </div>
                            <div v-else-if="scope.row.shipmentStatus == 'stopped'"><el-tag type="danger">已停止</el-tag>
                            </div>
                          </template>

                        </el-table-column>
                        <el-table-column prop="num" label="数量(主)" width="200" :key="7">
                          <template slot="header">
                            <span class="required">*</span>数量(主)
                          </template>
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.num" :disabled="btnType == 'look' ? true : false"
                              @input="watchNum(scope.row, scope.$index)" placeholder="请输入数量(主)"
                              @blur="checkNum(scope.row, scope.$index)">{{
                                scope.row.productName }}
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="mainUnit" label="单位(主)" width="200" :key="8" />
                        <el-table-column prop="deputyAvailableQuantity" label="可用库存(副)" width="200" :key="122"
                          v-if="btnType != 'look'">
                          <template slot-scope="scope">
                            <div> {{ scope.row.deputyAvailableQuantity ? scope.row.deputyAvailableQuantity : 0 }}</div>

                          </template>
                        </el-table-column>
                        <el-table-column prop="assistantNum" label="数量(副)" width="200" :key="9"></el-table-column>
                        <el-table-column prop="deputyUnit" label="单位(副)" width="200" :key="19" />
                        <el-table-column prop="price" label="单价(含税)" width="200" :key="11"></el-table-column>
                        <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="160"></el-table-column>

                        <el-table-column prop="taxRate" label="税率(%)" width="200" :key="171"></el-table-column>
                        <el-table-column prop="totalAmount" label="金额(含税)" width="200" :key="125"></el-table-column>
                        <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="200" :key="126">
                          <template slot-scope="scope">
                            <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deliveryDate" label="交货日期" width="200" :key="13">
                          <template slot="header">
                            <span class="required">*</span>交货日期
                          </template>
                          <template slot-scope="scope">
                            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                              :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择交货日期">
                            </el-date-picker>
                          </template>
                        </el-table-column>
                        <el-table-column prop="ask" label="要求" width="160" :key="14">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.ask" placeholder="请输入要求"
                              :disabled="btnType == 'look' ? true : false" maxlength="3000" />
                          </template>
                        </el-table-column>

                        <!-- 列表中显示的自定义属性 -->
                        <el-table-column v-for="item in customList" :key="item.prop" :prop="item.prop"
                          :label="item.label" min-width="180" :formatter="filterateLabel" />
                        <el-table-column prop="remark" label="备注1" width="200" :key="1">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" placeholder="请输入备注1"
                              :disabled="btnType == 'look' ? true : false" maxlength="200" />
                          </template>
                        </el-table-column>
                        <el-table-column prop="remark2" label="备注2" width="200" :key="111">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.remark2" placeholder="请输入备注2"
                              :disabled="btnType == 'look' ? true : false" maxlength="200" />
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" :key="15">
                          <template slot-scope="scope">

                            <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </vue-draggable-resizable>
                    <vue-draggable-resizable :w="width1 || 1" :h="height" class-name="dragging2" :x="10"
                      :draggable="false" :parent="true" :resizable="false">
                      <el-table v-bind="dataFormTwo.data" :data="dataFormTwo.data" size='mini' border id="table"
                        style="width: 100%" height="100%" v-loading="bomLoading">
                        <el-table-column type="index" width="60" label="序号" align="center" />
                        <el-table-column prop="productsCode" label="产品编码" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="productsName" label="产品名称" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="productsDrawingNo" label="产品图号" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="shoulderLength" label="夹肩长" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="bomsleeve" label="对应套筒" min-width="180" show-overflow-tooltip />
                        <el-table-column prop="bomsheath" label="对应护套" min-width="180" show-overflow-tooltip />
                        <el-table-column prop="qty" label="数量" min-width="120" show-overflow-tooltip />
                        <el-table-column prop="stockQty" label="库存数量" min-width="120" show-overflow-tooltip />
                      </el-table>
                    </vue-draggable-resizable>
                  </div>
                  <el-table ref="product" v-else :data="productData" :fixedNO="true"
                    @selection-change="handeleProductInfoData" border height="460" @row-click="rowclick" :key="1"
                    style="width: 100%;">
                    <el-table-column type="selection" width="55" fixed="left" v-if="btnType != 'look'" :key="2">
                    </el-table-column>
                    <el-table-column type="index" width="60" fixed="left" label="序号" :key="10">
                    </el-table-column>
                    <el-table-column prop="customerProductNo" label="客户物料号" width="150" :key="33" />
                    <el-table-column prop="customerProductDrawingNo" label="客户产品图号" width="150" :key="3">

                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="200" :key="4" />
                    <el-table-column prop="productName" label="产品名称" width="200" :key="5">
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="产品图号" min-width="320" :key="6" />
                    <el-table-column prop="availableQuantity" label="可用库存(主)" width="200" :key="121"
                      v-if="btnType != 'look'">
                      <template slot-scope="scope">
                        <div> {{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}</div>

                      </template>
                    </el-table-column>

                    <el-table-column prop="num" label="数量(主)" width="200" :key="7">
                      <template slot="header">
                        <span class="required">*</span>数量(主)
                      </template>
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.num" :disabled="btnType == 'look' ? true : false"
                          @input="watchNum(scope.row, scope.$index)" placeholder="请输入数量(主)"
                          @blur="checkNum(scope.row, scope.$index)">{{
                            scope.row.productName }}
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位(主)" width="200" :key="8" />
                    <el-table-column prop="deputyAvailableQuantity" label="可用库存(副)" width="200" :key="122"
                      v-if="btnType != 'look'">
                      <template slot-scope="scope">
                        <div> {{ scope.row.deputyAvailableQuantity ? scope.row.deputyAvailableQuantity : 0 }}</div>

                      </template>
                    </el-table-column>
                    <el-table-column prop="assistantNum" label="数量(副)" width="200" :key="9"></el-table-column>
                    <el-table-column prop="deputyUnit" label="单位(副)" width="200" :key="19" />
                    <el-table-column prop="price" label="单价(含税)" width="200" :key="11"></el-table-column>
                    <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="160"></el-table-column>
                    <el-table-column prop="taxRate" label="税率(%)" width="200" :key="171"></el-table-column>
                    <el-table-column prop="totalAmount" label="金额(含税)" width="200" :key="125"></el-table-column>
                    <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="200" :key="126">
                      <template slot-scope="scope">
                        <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="deliveryDate" label="交货日期" width="200" :key="13">
                      <template slot="header">
                        <span class="required">*</span>交货日期
                      </template>
                      <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd"
                          :disabled="btnType == 'look' ? true : false" style="width: 100%;" placeholder="请选择交货日期">
                        </el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column prop="ask" label="要求" width="160" :key="14">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.ask" placeholder="请输入要求"
                          :disabled="btnType == 'look' ? true : false" maxlength="3000" />
                      </template>
                    </el-table-column>

                    <!-- 列表中显示的自定义属性 -->
                    <el-table-column v-for="item in customList" :key="item.prop" :prop="item.prop" :label="item.label"
                      min-width="180" :formatter="filterateLabel" />
                    <el-table-column prop="remark" label="备注1" width="200" :key="1">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注1"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="remark2" label="备注2" width="200" :key="111">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark2" placeholder="请输入备注2"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" :key="15">
                      <template slot-scope="scope">

                        <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin-right:10px">总主数量：{{ totalNum }}</span>
                    <span style="font-weight:500;margin-right:10px">总副数量：{{ totalAssistantNum }}</span>
                    <span style="font-weight:500;margin-right:10px">总金额(含税)：{{ totalAmount }}</span>
                    <span style="font-weight:500;margin-right:10px">总金额(不含税)：{{ excludingTaxAmount }}</span>
                  </div>
                </el-collapse-item>

              </el-collapse>



              <!-- <div class="table-actions" @click="addProduct()" v-if="btnType !== 'look'">
              <el-button type="text" icon="el-icon-plus">添加</el-button>
            </div> -->
              <!-- <el-tabs v-model="activeNameDetail">
              <el-tab-pane label="产品信息" name="productInfo">
              </el-tab-pane>
            </el-tabs> -->

            </el-tab-pane>
            <el-tab-pane label="进度跟踪" name="schedule" v-if="btnType === 'look'" ref="orderInfos">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model.trim="scheduleForm.customerProductNo" placeholder="请输入客户物料号" clearable
                        @keyup.enter.native="searchDetail()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model.trim="scheduleForm.customerProductDrawingNo" placeholder="请输入客户图号" clearable
                        @keyup.enter.native="searchDetail()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model.trim="scheduleForm.productsDrawingNo" placeholder="请输入产品图号" clearable
                        @keyup.enter.native="searchDetail()" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-button size="mini" type="primary" icon="el-icon-search" @click="searchDetail()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetDetail()">{{
                        $t('common.reset') }}
                      </el-button>
                      <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
                    </el-form-item>
                  </el-col>
                  <el-button style="float: right;margin-right: 20px;" size="mini" type="primary"
                    icon="icon-ym icon-ym-report-icon-search-setting" @click="visible = true">更多查询</el-button>
                </el-form>
              </el-row>
              <JNPF-table v-loading="formLoading" :data="scheduleData" custom-column ref="scheduleRef"
                :style="{ height: customStyleData + 'px' }">
                <el-table-column prop="customerProductNo" label="客户物料号" min-width="160" />
                <el-table-column prop="customerProductDrawingNo" label="客户图号" min-width="160" />
                <el-table-column prop="productCode" label="产品编码" min-width="160" />
                <el-table-column prop="productName" label="产品名称" min-width="160" />
                <el-table-column prop="drawingNo" label="产品图号" min-width="180" />
                <el-table-column prop="mainUnit" label="单位(主)" min-width="140" />
                <el-table-column prop="num" label="数量(主)" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.num ? scope.row.num : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="utilizationQuantity" label="利用库存数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.utilizationQuantity ? scope.row.utilizationQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="productionQuantity" label="需生产数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.productionQuantity ? scope.row.productionQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="purchaseQuantity" label="需采购数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.purchaseQuantity ? scope.row.purchaseQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outsourcingQuantity" label="需外协数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outsourcingQuantity ? scope.row.outsourcingQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planFlag" label="是否转计划" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.planFlag ? '是' : '否' }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="calFlag" label="是否运算" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.calFlag ? '是' : '否' }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="sendDownFlag" label="是否下达生产" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.sendDownFlag ? '是' : '否' }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="completedQuantity" label="生产完成数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.completedQuantity ? scope.row.completedQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="prodSchedule" label="生产进度" min-width="160">
                  <template slot-scope="scope">
                    <el-progress
                      :percentage="Number((scope.row.completedQuantity / scope.row.productionQuantity * 100).toFixed(2)) || 0"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column prop="packingCount" label="生产已装箱数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.packingCount ? scope.row.packingCount : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="receivedQuantity" label="生产已入库数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.receivedQuantity ? scope.row.receivedQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="undeliveredQuantity" label="发货待出数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.undeliveredQuantity ? scope.row.undeliveredQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outboundQuantity" label="发货已出数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outboundQuantity ? scope.row.outboundQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliverSchedule" label="发货进度" min-width="160">
                  <template slot-scope="scope">
                    <el-progress
                      :percentage="Number((scope.row.outboundQuantity / scope.row.num * 100).toFixed(2)) || 0"></el-progress>
                  </template>
                </el-table-column>
                <el-table-column prop="shipmentStatus" label="发货状态" width="130" align="center">
                  <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.shipmentStatus == 'not_finish'">未完成</el-tag>
                    <el-tag type="success" v-else-if="scope.row.shipmentStatus == 'finish'">已完成</el-tag>
                    <el-tag type="danger" v-else-if="scope.row.shipmentStatus == 'stopped'">已停止</el-tag>
                  </template>

                </el-table-column>
                <el-table-column prop="returnQuantity" label="已退货数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.returnQuantity ? scope.row.returnQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="replacementQuantity" label="已换货数量" min-width="120">
                  <template slot-scope="scope">
                    <div>{{ scope.row.replacementQuantity ? scope.row.replacementQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="deliveryDate" label="交货日期" min-width="180" />
              </JNPF-table>
              <pagination :total="total" :page.sync="scheduleForm.pageNum" :background="background"
                :limit.sync="scheduleForm.pageSize" @pagination="searchDetail" />
              <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
              <el-dialog title="更多查询" :close-on-click-modal="false" :close-on-press-escape="false"
                :modal-append-to-body="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
                width="1000px">
                <el-row :gutter="20">
                  <el-form ref="diaForm" :model="scheduleForm" label-width="120px" label-position="top">
                    <el-col :span="12">
                      <el-form-item label="客户物料号">
                        <el-input v-model.trim="scheduleForm.customerProductNo" placeholder="请输入客户物料号" clearable
                          @keyup.enter.native="searchDetail()" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="客户图号">
                        <el-input v-model.trim="scheduleForm.customerProductDrawingNo" placeholder="请输入客户图号" clearable
                          @keyup.enter.native="searchDetail()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品编码">
                        <el-input v-model.trim="scheduleForm.productsCode" placeholder="请输入产品编码" clearable
                          @keyup.enter.native="searchDetail()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品名称">
                        <el-input v-model.trim="scheduleForm.productsName" placeholder="请输入产品名称" clearable
                          @keyup.enter.native="searchDetail()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="产品图号">
                        <el-input v-model.trim="scheduleForm.productsDrawingNo" placeholder="请输入产品图号" clearable
                          @keyup.enter.native="searchDetail()" />
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
                  <el-button type="primary" @click="searchDetail()">
                    {{ $t('common.search') }}
                  </el-button>
                </span>
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="附件" name="annex">
              <UploadWj v-model="datafilelist" :disabled="btnType === 'look'" :detailed="btnType === 'look'"></UploadWj>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-dialog title="选择客户" :close-on-click-modal="false" :close-on-press-escape="false"
          :visible.sync="customerVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
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
                      <el-input v-model="form.code" placeholder="请输入客户编码" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="form.taxId" placeholder="请输入税号" clearable />
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
                      <el-input v-model="ProductListRequestObj.code" placeholder="请输入产品编码" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="ProductListRequestObj.name" placeholder="请输入产品名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-input v-model="ProductListRequestObj.drawingNo" placeholder="请输入图号" clearable />
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
                  <el-table-column prop="name" label="产品名称" />
                  <el-table-column prop="drawingNo" label="图号" />
                  <el-table-column prop="spec" label="规格型号" />

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
        <!-- <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
          :http-request="UploadProduct" /> -->
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
          :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
          <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span  class="import_t"> 导入成功啦！</span><span  class="import_b">您还可以进行如下操作：</span></div>
           
          <div>
            <el-button type="text" @click="continueImport">继续导入</el-button>
              
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="tipsvisible = false">{{ $t('common.cancelButton') }}</el-button>
            <el-button type="primary" @click="tipsvisible = false">
              关闭弹框</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- <productForm v-if="productFormVisible" ref="productForm" @refresh="refresh" /> -->
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
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getQuotationdatalist } from "@/api/salesManagement/index"
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
import { log } from 'mathjs'

export default {
  props: {
    customList: {
      require: true,
      type: Array
    }
  },
  components: {
    changeAddress, VueDraggableResizable, ExportForm
  },
  data() {
    return {
      tipsvisible:false,
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
      getProductList,
      getcooperativeProduct,
      // 选择产品 弹框列表展示字段
      loadingText: '',
      ProductTableItems: [
        { prop: 'customerProductNo', label: '客户物料号', fixed: 'left' },
        { prop: 'customerProductDrawingNo', label: '客户图号', fixed: 'left' },
        { prop: 'productCode', label: '产品编码' },
        { prop: 'productName', label: '产品名称' },
        { prop: 'drawingNo', label: '产品图号' },
        { prop: 'mainUnit', label: '单位(主)' },
        { prop: 'deputyUnit', label: '单位(副)' },
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
        { prop: "customerProductNo", label: "客户物料号", type: 'input' },
        { prop: "productName", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' },
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
        { label: "物料分类", classAttribute: "material", method: productTree, requeseObj: { classAttribute: "material" } },
      ],
      allproductData: [],
      allProductTotal: 0,

      ProductTreeData: [],
      ProductListRequestObj: {
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        classAttribute: "",
        drawingNo: "",
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
      },
      attributeLines: [],
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
      paymentCycleList: [],
      activeNameDetail: 'productInfo',
      coverNum: "",//用于计算
      invoicingStatusList: [
        { label: "未开票", value: "not_invoiced" },
        { label: "部分开票", value: "partial_invoicing" },
        { label: "已开票", value: "invoiced" },
      ],
      orderProduceStateList: [
        { label: "未开始", value: "not_started" },
        { label: "已排计划", value: "planned" },
        { label: "已开始生产", value: "start_production" },
        { label: "已生产完成", value: "production_completed" },

      ],
      standardFlagList: [
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      orderStateList: [
        { label: "未完成", value: "not_finish" },
        { label: "已完成", value: "finish" },
        { label: "部分完成", value: "part_finish" }
      ],
      paymentStatusList: [
        { label: "未付款", value: "no_pay", },
        { label: "部分付款", value: "part_pay", },
        { label: "已付清", value: "payed", },
      ],
      deliveryList: [
        { label: "送货", value: "deliver_goods" },
        { label: "自提", value: "self_pickup" },
        { label: "快递", value: "express_delivery" },
        { label: "货运", value: "freight_transport" },
        { label: "到付", value: "collect_payment" },
      ],
      shippingControlList: [
        { label: "正常发货", value: "normal", },
        { label: "停止发货", value: "stop", },
      ],
      approvalStateList: [
        { label: "审批中", value: "ing" },
        { label: " 审批通过", value: "ok" },
        { label: "审批拒绝", value: "rebut" },
      ],
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],
      shipmentsStateList: [
        { label: "未发货", value: "unshipped" },
        { label: "部分发货", value: "partial_shipment" },
        { label: "发货完成", value: "shipment_completed" },
      ],
      btnType: undefined,
      bimVehicle: [],
      areaList: [],
      provinces: [],
      cities: [],
      area: [],
      contactsList: [],
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
        contractNo: "",
        contractId: "",
        departmentId: "",
        workOrderNo: "",
        sourceOrderNo: "",
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
        workOrderNo: [{ required: true, message: "请输入工作令号", trigger: 'blur' }],
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
      customStyleData: 0
      // productFormVisible: false
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
      console.log("totalAssistantNums", totalAssistantNums);
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
    this.getAttributeline()
    // this.getProvinceList()
    this.getDictionaryType()
  },
  mounted() {
    // window.addEventListener('resize', this.switchStyle)
    this.switchStyle()
    console.log("this.userInfo", this.userInfo);
    this.dataForm.departmentId = this.userInfo.departmentId
    this.dataForm.salesName = this.userInfo.userName
    this.dataForm.salesId = this.userInfo.userId
    getOrganizeInfo(this.dataForm.departmentId).then(sss => {
      console.log("sss===>", sss);
      this.organizeIdTrees = sss.data.organizeIdTree || []
      this.organizeIdTrees.push(this.dataForm.departmentId)
      if (this.organizeIdTrees[0] == '-1') {
        this.organizeIdTrees.shift()
      }
    })
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.switchStyle)
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
    switchStyle() {
      if (this.btnType !== 'look') return
      this.boxwidth = this.$refs.box.offsetWidth
      this.$refs.boxresiz.style.width = this.boxwidth + 'px'
      this.width1 = this.boxwidth - this.width - 10 > 0 ? this.boxwidth - this.width - 10 : 0
      window.onresize = () => {
        clearTimeout(this.width1out)
        this.width1out = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    handleResize(left, top, width, height) {
      this.width = width
      this.width1 = this.boxwidth - width - 10 > 0 ? this.boxwidth - width - 10 : 0
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
          if (flag) {
            this.uploadVisib = true

          }
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
    // 继续导入
    continueImport(){
      this.tipsvisible=false
      this.$refs['uploadRef'].clearFiles();
      this.uploadVisib=true
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
        this.tipsvisible=true
        this.uploadVisib = false
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.totalAmount = item.amounts
            item.excludingTaxAmount = item.excludingTaxAmounts
            if (this.dataForm.deliveryDate) {
              item.deliveryDate = this.dataForm.deliveryDate
            }
          });
          this.loadingText = ''
        }
        this.productData = res.data
        this.formLoading = false
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 下载模板
    downLoadTemplate() {
      const a = document.createElement('a')
      a.setAttribute('download', '')
      a.setAttribute('href', location.origin + '/static/销售订单导入模板.xlsx')
      a.click()
    },


    // 获取工作令号
    getWorkOrderNoFun() {
      getWorkOrderNo("ZC").then(res => {
        this.dataForm.workOrderNo = res.data
      })
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
      this.dataForm.salesId = val

    },
    // 选择合同
    selececontract(val) {
      if (val) {

        if (this.productData.length > 0) {
          this.$confirm('此操作将清空产品数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.productData = []
            this.createcontractId = val
            this.createcontractName = this.dataForm.contractNo
            this.dataForm.contractId = val
          }).catch(() => {
            this.dataForm.contractId = this.createcontractId
            this.dataForm.contractNo = this.createcontractName
          })
        } else {
          this.dataForm.contractId = val
          this.createcontractId = val
          this.createcontractName = this.dataForm.contractNo
        }

      }

    },
    // 选择车型
    // selecevehicle(val) {
    //   this.dataForm.vehicleTypeCorrespondingId = val
    // },
    changeOrderType(val) {
      if (val) {

        if (this.productData.length > 0) {
          this.$confirm('此操作将清空产品数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.createOrderType = val
            this.dataForm.contractId = ''
            this.dataForm.contractNo = ''
            this.productData = []
          }).catch(() => {
            this.dataForm.orderType = this.createOrderType
            if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
              this.contractFlag = true
            } else {
              this.contractFlag = false

            }
          })
        } else {
          this.dataForm.contractId = ''
          this.createOrderType = val
          this.dataForm.contractNo = ''
          this.createcontractName = ''
        }
      }
      if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
        this.contractFlag = true
      } else {
        this.contractFlag = false

      }
    },

    onOrganizeChangeHandle(val) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      this.dataForm.salesName = ""
      this.dataForm.salesId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.salesFlag = false

      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },

    goBack() {
      this.$emit('close')
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
        productArr[index].assistantNum = this.jnpf.numberFormat(row.num * row.ratio, 4)
        productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.price]), 6)
        productArr[index].excludingTaxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.excludingTaxPrice]), 6)
      } else {
        productArr[index].assistantNum = this.jnpf.numberFormat(row.num / row.ratio, 4)
        productArr[index].totalAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.price]), 6)
        productArr[index].excludingTaxAmount = this.jnpf.numberFormat(this.jnpf.math('multiply', [row.num, row.excludingTaxPrice]), 6)
      }
      console.log("productArr", productArr);
      this.productData = productArr
    },
    // 点击计算按钮
    computeWatch() {
      if (this.productData.length > 0) {
        this.productData.forEach((item, index) => {
          if (item.num) {
            this.productData[index].num = item.num * this.coverNum
            if (this.productData[index].calculationDirection == 'multiplication') {
              this.productData[index].assistantNum = this.jnpf.numberFormat(this.productData[index].num * this.productData[index].ratio, 4)
              this.productData[index].totalAmount = this.jnpf.numberFormat(this.productData[index].num * (this.productData[index].price || 0), 6)
              this.productData[index].excludingTaxAmount = this.jnpf.numberFormat(this.productData[index].num * (this.productData[index].excludingTaxPrice || 0), 6)
            } else {
              this.productData[index].assistantNum = this.jnpf.numberFormat(this.productData[index].num / this.productData[index].ratio, 4)
              this.productData[index].totalAmount = this.jnpf.numberFormat(this.productData[index].num * (this.productData[index].price || 0), 6)
              this.productData[index].excludingTaxAmount = this.jnpf.numberFormat(this.productData[index].num * (this.productData[index].excludingTaxPrice || 0), 6)
            }
          }
        });
      }
    },


    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
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
    // 单个删除
    handleDel(data) {
      this.productData.splice(data.$index, 1)
    },




    // 选完客户产品数据后 渲染在列表上
    submitCustomerProduct(val, data, paramsObj) {
      this.productVisible = false
      data.forEach(i => {
        const item = i.all

        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.price) / (1 + (Number(item.taxRate)) / 100), 6)
          console.log("item.price", item.price);
          console.log("item.purchasePrice", item.purchasePrice);
          console.log("excludingTaxPrice", item.excludingTaxPrice);
          console.log("123123", 1 + (Number(item.taxRate)) / 100);
        } else {
          item.excludingTaxPrice = item.price
        }
        if (this.btnType == 'edit') {
          item.id = ""
        }
        this.productData.push(item)
      });
    },


    // 选中客户产品
    handleSelectionChange(val) {
      console.log(3563456, val);
      this.selectArr = val
      this.$forceUpdate()
    },

    // 根据订单类型  打开不同的选择产品弹框
    openSeleceProductDialog() {
      if (this.dataForm.orderType == 'normal' || this.dataForm.orderType == 'urgent') {
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
      } else {
        this.allProVisible = true
        let arr = [];
        this.ProductListRequestObj = {
          classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
          classAttribute: "",
          drawingNo: "",
          queryType: 2,
          productStatus: 'enable',

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
      }


    },
    // 获取所有产品列表数据
    initData2() {
      this.listLoading = true
      getProductList(this.ProductListRequestObj).then(listRes => {
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
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
        classAttribute: "",
        drawingNo: "",
        productCategoryId: "",
        queryType: 2,

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
        item.productName = item.name,
          item.productCode = item.code,
          item.price = item.purchasePrice,
          item.productsId = item.id
        if (this.btnType == 'edit') {
          item.id = ""
        }
        if (item.taxRate) {
          item.excludingTaxPrice = this.jnpf.numberFormat(Number(item.purchasePrice) / (1 + (Number(item.taxRate)) / 100), 6)

        } else {
          item.excludingTaxPrice = item.purchasePrice
        }

        this.productData.push(item)
      });

      // this.productData=[...this.productData,...this.selectArr]
    },

    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then(res => {
        this.attributeLines = res.data
      })
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
      console.log("e====>", e);
      if (this.productData.length > 0) {
        this.$confirm('此操作将清空产品数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dataForm.contractId = ''
          this.dataForm.contractNo = ''
          this.productData = []
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
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          console.log(56565656);
          this.ProductListRequestObjs.partnerId = e.id
          console.log("this.ProductListRequestObjs", this.ProductListRequestObjs);
          this.dataForm.cooperativePartnerName = e.name
          this.dataForm.cooperativePartnerCode = e.code

          this.dataForm.code = e.code
          this.customerVisible = false
          this.getQuotationdatalist()


          // }
          if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
            this.contractFlag = true
          } else {
            this.contractFlag = false

          }
        }).catch(() => {
          this.customerVisible = false
        })
      } else {
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
        this.customerData = e
        this.dataForm.cooperativePartnerId = e.id
        this.dataForm.cooperativePartnerName = e.name
        this.dataForm.cooperativePartnerCode = e.code
        this.ProductListRequestObjs.partnerId = e.id


        this.dataForm.code = e.code
        this.customerVisible = false
        this.getQuotationdatalist()
        // if (e.country) {
        //   this.changeCountry(e.country)
        // }
        // if (e.province) {
        //   let obj = {
        //     id: e.province
        //   }
        //   this.changeProvince(obj)

        // }
        // if (e.city) {
        //   let ooo = {
        //     id: e.city
        //   }
        //   this.changeCity(ooo)


        // }
        if (this.dataForm.orderType != 'normal' && this.dataForm.orderType != 'urgent') {
          this.contractFlag = true
        } else {
          this.contractFlag = false

        }
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
    // 获取合同数据
    getQuotationdatalist() {
      let orderForm = {
        pageNum: 1,
        pageSize: -1,
        cooperativePartnerCode: this.dataForm.cooperativePartnerCode,
        useDayFilter: true,
      };
      getQuotationdatalist(orderForm).then(res => {
        if (res.data.records.length > 0) {
          res.data.records.forEach(item => {
            item.options = item.contractNo + "/" + item.validityStart + "/" + item.validityEnd
          });
        }
        this.contactsList = res.data.records
        if (this.contactsList.length > 0) {
          this.contactsList.forEach(item => {
            if (item.id == this.dataForm.contractId) {
              this.dataForm.contractNo = item.options
            }
          });
        }
      })
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
          this.switchStyle()
        })
      } else if (tab.name == "schedule") {
        this.switchStyleheight()
        this.scheduleForm = JSON.parse(JSON.stringify(this.scheduleForm1))
        this.resetDetail()
      }
    },
    // 根据选择的省份获取相应的城市数据
    // changeProvince(item, row) {
    //   console.log("item", item);
    //   getProvinceList(item.id).then(res => {
    //     console.log(res);
    //     this.cities = res.data.list
    //   })
    // },
    // // 根据选择的城市获取各区的数据
    // changeCity(item, row) {
    //   console.log(item, row);

    //   console.log("item", item);
    //   getProvinceList(item.id).then(res => {
    //     console.log(res);
    //     this.area = res.data.list
    //   })
    // },
    // // 获取省份数据
    // getProvinceList() {
    //   getProvinceList(this.nodeId, this.listQuery).then(res => {
    //     console.log("省份数据", res);
    //     this.provinces = res.data.list
    //   }).catch(() => {
    //     this.listLoading = false
    //     this.btnLoading = false
    //     this.refreshTable = true
    //   })
    // },


    // 获取等级、付款方式数据
    getDictionaryType() {
      getDictionaryType().then(res => {
        console.log("rescc", res);
        let data = res.data.list
        data.forEach(item => {
          if (item.enCode == "partnerArchives") {
            let children = item.children
            children.forEach(resp => {
              if (resp.enCode == "paymentMethod") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  console.log("付款方式", response);
                  this.paymentMethodList = response.data.list
                })
              }
              if (resp.enCode == "paymentCycle") {
                let id = resp.id;
                let obj = {
                  keyword: '',
                  isTree: 0
                }
                getDictionaryDataList(id, obj).then(response => {
                  this.paymentCycleList = response.data.list
                })
              }

            });

          }

        });
      })
    },



    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (data && data.codeWay == 'auto') {
          const orderNo = await this.jnpf.getCodeWayFun(code)
          this.dataForm.orderNo = orderNo
        }
      } catch (error) {
      }
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType == 'add' || this.btnType == 'copy') {
        setTimeout(() => {
          this.getWorkOrderNoFun()

        }, 500);
        this.fetchData("SHDD")
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

      }



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
              this.getQuotationdatalist()
              if (!this.dataForm.cooperativePartnerId) {
                this.contractFlag = true
              } else {
                this.contractFlag = false

              }
              if (this.btnType == 'look') {
                this.switchStyle()
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
                  if (res.data.length > 0) {
                    res.data.forEach(item => {
                      item.name = item.fullName.split('/')[0]
                    });
                  }
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
          getCopyOrders(this.dataForm.id).then(res => {
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
            this.dataForm.distributeStatus = "undistributed"
            this.dataForm.planStatus = "not_generated"
            this.dataForm.orderState = "not_finish"
            this.dataForm.deliveryCompletionDate = ""
            this.dataForm.paymentMethod = res.data.order.paymentMethod
            this.dataForm.paymentCycle = res.data.order.paymentCycle
            this.getQuotationdatalist()
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
          })
        }


      } else {
        this.salesFlag = true

      }



    },
    // 获取车型
    // getBimVehicleTypeData() {
    //   let objData = {
    //     "code": "",
    //     "createByName": "",
    //     "customerDrawingNo": "",
    //     "drawingNo": "",
    //     "endTime": "",
    //     "keyword": "",
    //     "name": "",
    //     "ncode": "",
    //     "nname": "",
    //     "orderItems": [
    //       {
    //         "asc": true,
    //         "column": ""
    //       }
    //     ],
    //     "pageNum": 1,
    //     "pageSize": -1,
    //     "startTime": "",
    //     "station": "",
    //     "vehicleModel": ""
    //   }
    //   getBimVehicleTypeData(objData).then(res => {
    //     this.bimVehicle = res.data.records
    //     this.bimVehicle.forEach(item => {
    //       if (item.id == this.dataForm.vehicleTypeCorrespondingId) {
    //         this.dataForm.vehicleTypeCorrespondingName = item.name
    //       }
    //     });
    //   })
    // },
    goBack() {
      this.$emit('close')
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

          let submitFlag = null;

          let f = {};

          this.customList.forEach(item => {
            f[item.prop] = ""
          })
          this.dataForm.documentStatus = value
          this.dataForm.excludingTaxTotalAmount = this.excludingTaxAmount
          this.dataForm.totalAmount = this.totalAmount
          this.dataForm.taxAmount = this.totalAmount - this.excludingTaxAmount
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
          let obj = {
            attachmentList: this.datafilelist,
            order: this.dataForm,
            attributeLines: this.attributeLines,
            orderLines: [],
          }
          if (this.productData.length < 1) {
            submitFlag = false
            this.$message({
              message: "请选择产品",
              type: 'error',
              duration: 1500,
            })
            return
          } else {
            for (let index = 0; index < this.productData.length; index++) {
              const item = this.productData[index];
              if (!item.num) {
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
              if (Number(item.assistantNum) == 0) {
                submitFlag = false
                this.$message({
                  message: "第" + (index + 1) + "行产品的副数量必须大于0",
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
                //   if(!item.taxRate){
                //     submitFlag = false
                //     this.$message({
                //       message: "第" + (index + 1) + "行产品的税率不能为空",
                //       type: 'error',
                //       duration: 1500,
                //     })
                //     break
                // }
              }



            }
            this.productData.forEach((item, index) => {
              item.itemNumber = index + 1
              item.approvalStatus = ""
              item.shipmentStatus = ""
              let objs = {
                line: {},
                values: {}
              };
              if (this.btnType == "copy") {
                item.outboundQuantity = "0"
              }
              objs.line = item
              objs.values = this.extractSameKeys(f, item,)
              objs.values['orderAttributeType'] = 'sale_order'
              obj.orderLines.push(objs)
            });
          }
          if (submitFlag === false) return
          this.btnLoading = true
          let formMethod = null;
          if (this.btnType == 'edit') {
            formMethod = editOrders
          } else if (this.btnType == 'add' || this.btnType == 'copy') {
            formMethod = addOrders
          }
          formMethod(obj).then(res => {
            let msg = "";
            if (value == "draft") {
              msg = "保存成功"
            } else {
              msg = "提交成功"
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
      })
    },
    filterateLabel(row, column, cellValue) {
      if (!cellValue) return ""
      if (cellValue.includes(":")) {
        return cellValue.replace(/:(.*?)(,|$)/g, "$2");
      } else {
        return cellValue;
      }
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
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

//.el-button--small {
// padding: 1;
//}</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 ;
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
  padding: 0 5px 0px;
  border-top:none!important;

}
::v-deep .el-collapse-item__content{
  padding-bottom: 5px
}


.import_t{
  font-size: 22px;
    color: rgb(103, 194, 58);
    vertical-align: top;
    margin-top: 40px;
    display: inline-block;
    margin-left: 20px;
}
.import_b{
  font-size: 18px;
    /* color: #67c23a; */
    vertical-align: top;
    margin-top: 43px;
    display: inline-block;
}
.orderInfo ::v-deep  .el-collapse-item__wrap{
  border-bottom: none!important
}
</style>