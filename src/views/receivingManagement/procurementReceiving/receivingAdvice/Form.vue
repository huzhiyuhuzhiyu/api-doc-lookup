<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']" v-if="!approvalFlag">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add'
          ? '新建收货单'
          : btnType == 'edit'
            ? '编辑收货单'
            : btnType == 'copy'
              ? '新建收货单'
              : '查看收货单'
          " />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交
          </el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit', 'print')">
            提交并打印
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" ref="main" v-loading="formLoading">
        <el-tabs v-model="activeName" v-if="!approvalFlag" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="orderInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                  <el-row :gutter="30" style="padding:0 10px">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="单号" prop="orderNo">
                        <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="btnType == 'look'
                          ? true
                          : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                            ? false
                            : true
                          "></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="仓库" prop="warehouseId">
                        <el-select v-model="dataForm.warehouseId" placeholder="请选择仓库" style="width: 100%;"
                          :disabled="btnType == 'look' ? true : false" clearable @change="warehouseIdChange">
                          <el-option v-for="(item, index) in warehouseIdList" :key="index" :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <el-form-item label="供应商名称" prop="partnerName">
                        <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly @focus="openDialog"
                          :disabled="btnType == 'look'"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="操作人" prop="salesman">
                        <el-input v-model="dataForm.salesman" placeholder="请选择操作人"
                          :disabled="btnType == 'look'"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="收货日期" prop="deliverDate">
                        <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择收货日期" type="date"
                          :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                          :disabled="btnType == 'look'" style="width: 100%;" clearable></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                      <el-form-item label="创建人" prop="createByName">
                        <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                          maxlength="20" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="12" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'"
                          type="textarea" maxlength="200" :rows="2" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="产品信息" name="productInfo">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;font-size:14px!important"
                    :disabled="btnType == 'look' ? true : false" @click="scanFun()">
                    <i class="iconfont icon-saoma"></i>
                    扫码录入
                  </el-button>
                  |
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    icon="el-icon-plus" @click="openSeleceProductDialog()">
                    选择产品
                  </el-button>
                  |
                  <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                  :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择订单</el-button>| -->
                  <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                    :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                    批量删除
                  </el-button>
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form"
                  :rules="productRules">
                  <JNPF-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.productData" :hasC="btnType !== 'look'" hasNO fixedNO
                    @selection-change="handeleProductInfoData" :height="customStyleData">
                    <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"
                      key="2"></el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="200" show-overflow-tooltip key="3" />
                    <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="productCode" label="产品编码" width="140" key="4" />
                    <el-table-column prop="productCategoryName" label="产品分类" width="140"
                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
                      :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
                    <el-table-column prop="purchaseQuantity" :label="isDeputyUnitSwitch === '1' ? '数量(主)' : '数量'"
                      width="110" />
                    <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
                    <el-table-column prop="purchaseQuantity2" label="数量(副)" width="110"
                      v-if="isDeputyUnitSwitch === '1'" />
                    <el-table-column v-if="btnType !== 'look'" prop="waitReceiptNum" label="待收货数量" width="160" />

                    <el-table-column prop="weight" label="重量(kg)" width="140" :key="737"
                      v-if="isProportionSwitch === '1'">
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                          v-model="scope.row.weight" placeholder="重量"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="proportion" label="比重" width="140" :key="727"
                      v-if="isProportionSwitch === '1'">
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                          v-model="scope.row.proportion" placeholder="比重"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="discount" label="折扣(0~1)" width="140" :key="717"
                      v-if="isProportionSwitch === '1'">
                      <template slot-scope="scope">
                        <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                          v-model="scope.row.discount" placeholder="折扣(0~1)"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column prop="receivedQuantity" label="收货数量" min-width="130"
                      v-if="!dataForm.exchangeGoodsFlag" :key="719">
                      <template slot="header">
                        <span class="required">*</span>
                        收货数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'receivedQuantity'"
                          :rules="productRules.receivedQuantity">
                          <el-input v-model="scope.row.receivedQuantity" placeholder="请输入收货数量"
                            :disabled="btnType == 'look'" maxlength="11" @input="watchnums(scope.row, scope.$index)">
                            {{ scope.row.receivedQuantity }}
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="单价(含税)" width="130" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <template slot-scope="scope">
                        <el-form-item>
                          <div class="viewData">
                            <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="totalAmount" label="金额" width="140" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <template slot-scope="scope">
                        <el-form-item>
                          <div class="viewData">
                            <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="taxRate" label="税率" width="140" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <template slot-scope="scope">
                        <el-form-item>
                          <div class="viewData">
                            <span>{{ scope.row.taxRate ? scope.row.taxRate : 0 }}%</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <template slot-scope="scope">
                        <el-form-item>
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxPrice }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>

                    <el-table-column prop="taxAmount" label="税额" min-width="100" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <template slot="header">
                        <span class="required">*</span>
                        税额
                      </template>
                      <template slot-scope="scope">
                        <el-form-item>
                          <div class="viewData">
                            <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="180" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                      <template slot="header">
                        <span class="required">*</span>
                        金额(不含税)
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxAmount'">
                          <div class="viewData">
                            <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                          </div>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="material" label="材质" width="130" :key="1015"
                      v-if="materialFlag == 1"></el-table-column>
                    <el-table-column prop="colour" label="颜色" width="130" :key="1015"
                      v-if="colourFlag == 1"></el-table-column>
                    <el-table-column prop="processName" label="工序" width="110" />
                    <el-table-column prop="ordersNo" label="订单号" width="200" />
                    <el-table-column prop="remark" label="备注" min-width="200">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="请输入备注"
                          :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                      </template>
                    </el-table-column>

                    <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                    <span style="font-weight:500;margin:0 10px">总收货数量：{{ totalDeliveryQuantity }}</span>
                  </div>
                </el-form>
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
            <recordList :list="flowTaskOperatorRecordList" :endTime="endTime" />
          </el-tab-pane>
        </el-tabs>
        <el-collapse v-model="activeNames" v-else>
          <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" style="padding: 0 10px;">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="单号" prop="orderNo">
                    <el-input v-model="dataForm.orderNo" placeholder="请选择单号" :disabled="btnType == 'look'
                      ? true
                      : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                        ? false
                        : true
                      "></el-input>
                  </el-form-item>
                </el-col>

                <el-col :sm="6" :xs="24">
                  <el-form-item label="仓库" prop="warehouseId">
                    <el-select v-model="dataForm.warehouseId" placeholder="请选择仓库" style="width: 100%;"
                      :disabled="btnType == 'look' ? true : false" clearable @change="warehouseIdChange">
                      <el-option v-for="(item, index) in warehouseIdList" :key="index" :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <el-form-item label="供应商名称" prop="partnerName">
                    <el-input v-model="dataForm.partnerName" placeholder="请选择供应商" readonly @focus="openDialog"
                      :disabled="btnType == 'look'"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="操作人" prop="salesman">
                    <el-input v-model="dataForm.salesman" placeholder="请选择操作人" :disabled="btnType == 'look'"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="收货日期" prop="deliverDate">
                    <el-date-picker v-model="dataForm.deliverDate" placeholder="请选择收货日期" type="date"
                      :disabled="btnType == 'look'" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker v-model="dataForm.createTime" type="datetime" placeholder="请选择创建时间"
                      :disabled="btnType == 'look'" style="width: 100%;" clearable></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                  <el-form-item label="创建人" prop="createByName">
                    <el-input v-model="dataForm.createByName" placeholder="请输入创建人" :disabled="btnType == 'look'"
                      maxlength="20" />
                  </el-form-item>
                </el-col>

                <el-col :sm="12" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'"
                      type="textarea" maxlength="200" :rows="2" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="产品信息" name="productInfo">
            <div v-if="btnType !== 'look'">
              <el-button type="text" style="margin-right:8px;font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" @click="scanFun()">
                <i class="iconfont icon-saoma"></i>
                扫码录入
              </el-button>
              |
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                icon="el-icon-plus" @click="openSeleceProductDialog()">
                选择产品
              </el-button>
              |
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus"
                  :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择订单</el-button>| -->
              <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">
                批量删除
              </el-button>
            </div>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <JNPF-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.productData" :hasC="btnType !== 'look'" hasNO fixedNO
                @selection-change="handeleProductInfoData" :height="customStyleData">
                <el-table-column prop="projectName" label="所属项目" width="120" v-if="isProjectSwitch === '1'"
                  key="2"></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" width="200" show-overflow-tooltip key="3" />
                <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="140" key="4" />
                <el-table-column prop="productCategoryName" label="产品分类" width="140"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="mainUnit" :label="isDeputyUnitSwitch === '1' ? '单位(主)' : '单位'"
                  :width="isDeputyUnitSwitch === '1' ? 85 : 60" />
                <el-table-column prop="purchaseQuantity" :label="isDeputyUnitSwitch === '1' ? '数量(主)' : '数量'"
                  width="110" />
                <el-table-column prop="deputyUnit" label="单位(副)" width="85" v-if="isDeputyUnitSwitch === '1'" />
                <el-table-column prop="purchaseQuantity2" label="数量(副)" width="110" v-if="isDeputyUnitSwitch === '1'" />
                <el-table-column v-if="btnType !== 'look'" prop="waitReceiptNum" label="待收货数量" width="120" />

                <el-table-column prop="weight" label="重量(kg)" width="140" :key="737" v-if="isProportionSwitch === '1'">
                  <template slot-scope="scope">
                    <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                      v-model="scope.row.weight" placeholder="重量"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="proportion" label="比重" width="140" :key="727" v-if="isProportionSwitch === '1'">
                  <template slot-scope="scope">
                    <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                      v-model="scope.row.proportion" placeholder="比重"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="discount" label="折扣(0~1)" width="140" :key="717"
                  v-if="isProportionSwitch === '1'">
                  <template slot-scope="scope">
                    <el-input :disabled="btnType == 'look'" @blur="computedNumFun(scope.row, scope.$index)"
                      v-model="scope.row.discount" placeholder="折扣(0~1)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="receivedQuantity" label="收货数量" min-width="140" v-if="!dataForm.exchangeGoodsFlag"
                  key="789">
                  <template slot="header">
                    <span class="required">*</span>
                    收货数量
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'receivedQuantity'"
                      :rules="productRules.receivedQuantity">
                      <el-input v-model="scope.row.receivedQuantity" placeholder="请输入收货数量" :disabled="btnType == 'look'"
                        maxlength="11" @input="watchnums(scope.row, scope.$index)">
                        {{ scope.row.receivedQuantity }}
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="单价(含税)" width="130" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <template slot="header">
                    <span class="required">*</span>
                    单价(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item>
                      <div class="viewData">
                        <span>{{ scope.row.price ? scope.row.price : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="totalAmount" label="金额" width="140" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <template slot="header">
                    <span class="required">*</span>
                    金额(含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'totalAmount'">
                      <div class="viewData">
                        <span>{{ scope.row.totalAmount ? scope.row.totalAmount : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率" width="140" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <template slot="header">
                    <span class="required">*</span>
                    税率
                  </template>
                  <template slot-scope="scope">
                    <el-form-item>
                      <div class="viewData">
                        <span>{{ scope.row.taxRate ? scope.row.taxRate : 0 }}%</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="excludingTaxPrice" label="单价(不含税)" width="150" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxPrice'">
                      <div class="viewData">
                        <span>{{ scope.row.excludingTaxPrice }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>

                <el-table-column prop="taxAmount" label="税额" min-width="100" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <template slot="header">
                    <span class="required">*</span>
                    税额
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'taxAmount'">
                      <div class="viewData">
                        <span>{{ scope.row.taxAmount ? scope.row.taxAmount : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxAmount" label="金额(不含税)" width="180" v-if="userInfo.roleCode.split(',').includes('show_procure_data')">
                  <template slot="header">
                    <span class="required">*</span>
                    金额(不含税)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'productData.' + scope.$index + '.' + 'excludingTaxAmount'">
                      <div class="viewData">
                        <span>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</span>
                      </div>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="material" label="材质" width="130" :key="1015"
                  v-if="materialFlag == 1"></el-table-column>
                <el-table-column prop="colour" label="颜色" width="130" :key="1015"
                  v-if="colourFlag == 1"></el-table-column>
                <el-table-column prop="processName" label="工序" width="110" />
                <el-table-column prop="ordersNo" label="订单号" width="180" />
                <el-table-column prop="remark" label="备注" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注"
                      :disabled="btnType == 'look' ? true : false" maxlength="200" show-overflow-tooltip />
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="120" fixed="right" v-if="btnType != 'look'" key="24">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleDel(scope)" style="color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin:0 10px">总收货数量：{{ totalDeliveryQuantity }}</span>
              </div>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-dialog title="选择供应商" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="customerVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="80%"
        append-to-body @close="handleClose">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-left">
            <div class="JNPF-common-title">
              <h2>供应商分类</h2>
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
                <span class="custom-tree-node" slot-scope="{ data }" :title="data.name">
                  <i :class="[
                    data.childrenList.length > 0 ? 'icon-ym icon-ym-tree-organization3' : 'icon-ym icon-ym-systemForm'
                  ]" />
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
                    <el-input @keyup.native.enter="search()" v-model="form.code" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()" v-model="form.name" placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="search()" v-model="form.taxId" placeholder="请输入税号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="tableDataCustomer" @row-dblclick="seleceCustomer">
                <el-table-column prop="code" label="供应商编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="供应商名称" />
                <el-table-column prop="taxId" label="税号" />
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button type="text" @click="seleceCustomer(scope.row)" size="mini">选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="form.pageNum" :limit.sync="form.pageSize" @pagination="initData" />
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="选择产品" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%"
        append-to-body @close="productVisible = false">
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun()" v-model="orderForm.productDrawingNo"
                      placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchProductFun()" v-model="orderForm.productCode"
                      placeholder="请输入产品编码" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="">
                    <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="交货开始日期" end-placeholder="交货结束日期"
                      clearable></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductFun()">
                      {{ $t('common.search') }}
                    </el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProductFun()">
                      {{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="productList" hasC
                @selection-change="handleSelectionChangeAllPruduct">
                <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
                <el-table-column prop="projectName" label="所属项目" width="120"
                  v-if="isProjectSwitch === '1'"></el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" width="200" show-overflow-tooltip />
                <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="130" />

                <el-table-column prop="mainUnit" label="单位" width="160" />
                <el-table-column prop="purchaseQuantity" label="数量" width="160" />
                <el-table-column prop="waitReceiptNum" label="待收货数量" width="160" />
                <el-table-column prop="deliveryDate" label="交货日期" min-width="200"></el-table-column>

                <el-table-column prop="processName" label="工序" min-width="200"></el-table-column>
                <el-table-column prop="remark" label="备注" width="160" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
              </JNPF-table>
              <pagination :total="productTotal" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="searchProductFun" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="productVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
        width="500px">
        <div>
          <img src="@/assets/images/importSuccess.gif" alt="" style="width:100px" />
          <span class="import_t">{{ submitmethodsTitle }}啦！</span>
          <span class="import_b">您还可以进行如下操作：</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="goBack">返回列表</el-button>
          <el-button v-if="btnType == 'edit'" type="primary" @click="continueEdit()">{{ btnText }}</el-button>
          <el-button v-else type="primary" @click="continueAdd()">{{ btnText }}</el-button>
        </span>
      </el-dialog>
      <el-dialog title="扫码录入" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
        :show-close="true" :visible.sync="scanDialog" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px"
        @close="closeScanDiaFun()">
        <div class="scand">
          <div class="box">
            <el-input v-model="scanResult" ref="inputRef" placeholder="请扫产品码"
              @keyup.enter.native="getProductFun()"></el-input>
            <div class="tip">说明：根据产品码自动添加对应的产品</div>
          </div>
        </div>
      </el-dialog>
      <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
        :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
      <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm"
        @closePrintPage="closePrintPage" />
    </div>
  </transition>
</template>

<script>
import { getProvinceList } from '@/api/system/province'
import { getsaleOrderList } from '@/api/salesManagement/assemblyOrders'
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类 编排属性值
import {
  getcategoryTrees,
  getAttributeline,
  getOrderDetail,
  getsaleOrderDetailList
} from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { detailpurchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index'
import {
  addpurPurchaseReceiptReturnGoods,
  editpurPurchaseReceiptReturnGoods,
  getpurPurchaseReceiptReturnGoodsdetail
} from '@/api/purchasingManagement/purchaseInquirySheet' // 询价单
import { getWarehouseList, getBimBusinessDetail, getOrderFiledMap } from '@/api/basicData/index'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import Process from '@/components/Process/Preview'
import busFlow from '@/mixins/generator/busFlow'
import recordList from '@/views/workFlow/components/RecordList.vue'
import { mapGetters } from 'vuex'
import getProjectList from '@/mixins/generator/getProjectList'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo } from '@/api/system/printDev'
export default {
  components: { Process, recordList, PrintBrowse, PrintDialog },
  mixins: [busFlow, getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      isProductNameSwitch: '',
      isProportionSwitch: '',
      tableDataFlag: false,
      isDeputyUnitSwitch: '',
      isattachmentswitch: '',
      categoryId: '',
      scanDialog: false,
      tipsvisible: false,
      submitmethodsTitle: '',
      btnText: '',
      productList: [],
      deliveryDateArr: [],
      activeNames: ['productInfo', 'basicInfo'],
      productTotal: 0,
      codeConfig: {},
      datafilelist: [],
      provinces: [],
      orderForm: {
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        receiptQueryFlag: 1,
        endTime: '',
        orderNo: '',
        orderType: 'procure',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: '',
        classAttribute: 'other',
        receivingStatus: 'receiving'
      },
      scanResult: '',
      // orderList: [
      //   { label: "外协通知", value: "external" },
      //   { label: "采购通知", value: "sale" },
      // ],
      inspectionStatusList: [
        { label: '待检验', value: 'unInspect' },
        { label: '已检验', value: 'inspected' },
        { label: '检验中', value: 'inspecting' }
      ],
      deliveryStatusList: [
        { label: '未完成', value: 'not_returned' },
        { label: '已完成', value: 'returned' },
        { label: '已取消', value: 'canceled' }
      ],
      documentStatusList: [{ label: '收货', value: false }, { label: '换货', value: true }],
      approvalStatusList: [
        { label: '审批中', value: 'ing' },
        { label: '审批通过', value: 'ok' },
        { label: '审批拒绝', value: 'rebut' }
      ],
      orderListtf: [{ label: '收货', value: 'back' }, { label: '发货', value: 'delivery' }],
      orderListdd: [
        { label: '外贸', value: 'foreign_trade' },
        { label: '内销', value: 'domestic_market' },
        { label: '总成', value: 'assembly' }
      ],
      orderListfhfs: [
        { label: '送货', value: 'deliver_goods' },
        { label: '自提', value: 'self_pickup' },
        { label: '快递', value: 'express_delivery' },
        { label: '货运', value: 'freight_transport' },
        { label: '到付', value: 'collect_payment' }
      ],
      orderList: [
        { label: '正常任务', value: 'normal' },
        { label: '预测订单', value: 'prediction' },
        { label: '样品订单', value: 'sample' },
        { label: '备货订单', value: 'stock_up' },
        { label: '急件订单', value: 'urgent' }
      ],
      productRules: {
        receivedQuantity: [
          {
            validator: this.formValidate({
              type: 'noEmtry',
              params: [
                '',
                (errMsg, index) => {
                  console.log(index)
                  this.$message.error(`产品信息第${index + 1}行：收货数量${errMsg}`)
                }
              ]
            }),
            trigger: ['blur']
          },
          // { validator: this.calcValidate(), trigger: 'blur' },
          { validator: this.calcValidatenum(), trigger: 'blur' }
        ]
      },
      ordersLineId: '',
      code: '',
      iszhi: false,
      totalNum: 0,
      totalAssistantNum: 0,
      totalAmount: 0,
      // 选择客户产品参数
      productForm: {
        //   drawingNo: "",
        productCode: '',
        productName: '',
        partnerId: '',
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
        pageSize: 20
      },
      productVisible: false,
      cusPrototal: 0, //选择客户产品分页器的总条数
      cusProductData: [],
      // 选择全部产品参数
      allProVisible: false,
      ProductMethodArr: [
        {
          label: '产品分类',
          classAttribute: '',
          method: getcategoryTree,
          requestObj: { classAttribute: '' }
        }
      ],
      allproductData: [],
      allProductTotal: 0,
      orderDateArr: [],
      ProductTreeData: [],
      ProductListRequestObj: {
        // neOrderState: 'finish',
        orderNo: '',
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        orderType: '',
        salesName: '',
        workOrderNo: '',
        sourceOrderNo: '',
        orderStartDate: '',
        orderEndDate: '',
        contractNo: '',
        deliveryStartDate: '',
        deliveryEndDate: '',
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: '',
        orderState: '',
        productionStatus: '',
        documentStatus: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      },
      attributeLines: [],
      dataFormTwo: {
        productData: []
      },
      listLoading: false,
      total: 0,
      tableDataCustomer: [],
      treeData: [],
      form: {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
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
      coverNum: '', //用于计算
      invoicingStatusList: [
        { label: '未开票', value: 'not_invoiced' },
        { label: '部分开票', value: 'partial_invoicing' },
        { label: '已开票', value: 'invoiced' }
      ],
      btnType: undefined,
      areaList: [],
      provinces: [],
      cities: [],
      areas: [],
      contactsList: [],
      deliveryAddressList: [],
      countryList: [],
      listQuery: {
        keyword: ''
      },
      activeName: 'orderInfo',
      nodeId: -1,
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataForm: {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        warehouseId: '',
        createTime: '',
        createByName: '',
        id: '',
        // orderCategory: "assembly",
        returnDeliveryType: 'back',
        notificationType: 'procure',
        salesman: '',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      },
      defaultAddress: '',
      parentId: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      dataRule: {
        salesman: [{ required: true, message: '操作人不能为空', trigger: 'blur' }],
        partnerName: [{ required: true, message: '所属供应商不能为空', trigger: 'change' }],
        exchangeGoodsFlag: [{ required: true, message: '换货标识不能为空', trigger: 'change' }],
        orderNo: [{ required: true, message: '订单编号不能为空', trigger: 'change' }],
        deliverDate: [{ required: true, message: '收货日期不能为空', trigger: 'change' }]
      },
      customerData: {},
      treeLoading: false,
      selectRows: [],
      warehouseIdList: [],
      flowTemplateJson: {},
      flowData: {},
      approvalFlag: false, // 待办事宜等页面 需要
      flowTaskOperatorRecordList: [],
      endTime: 0,
      selectArr: [],
      customStyleData: 0,
      formLoading: true,
      prindId: '',
      formId: '',
      enCode: '',
      printBrowseVisible: false,
      printVisible: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    // 总发货数量
    totalDeliveryQuantity: function () {
      var totalNum = 0
      console.log(this.dataFormTwo.productData, 'oooo')
      if (this.dataFormTwo.productData) {
        for (var i = 0; i < this.dataFormTwo.productData.length; i++) {
          totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.productData[i].receivedQuantity])
        }
      }

      return totalNum
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val)
    },
    'dataFormTwo.productData': {
      // immediate:true,
      handler: function (newVal, oldVal) {
        newVal.forEach((item) => {
          if ((item.price && item.taxRate) || (item.price && item.taxRate === 0)) {
            item.excludingTaxPrice = this.jnpf.numberFormat(item.price / (1 + (item.taxRate * 1) / 100))
          } else {
            item.excludingTaxPrice = ''
          }
          if (item.receivedQuantity && item.excludingTaxPrice) {
            item.excludingTaxAmount = this.jnpf.numberFormat(item.receivedQuantity * item.excludingTaxPrice)
          } else {
            item.excludingTaxAmount = ''
          }
          if (item.price && item.receivedQuantity && item.excludingTaxAmount) {
            item.taxAmount = this.jnpf.numberFormat(item.price * item.receivedQuantity - item.excludingTaxAmount)
          } else {
            item.taxAmount = ''
          }
          if (item.excludingTaxAmount && item.taxAmount) {
            item.totalAmount = this.jnpf.numberFormat(item.excludingTaxAmount * 1 + item.taxAmount * 1)
          } else {
            item.totalAmount = ''
          }
          // if (!item.price) {
          //   this.$message.error('未找到供应商单价')
          // }
        })
      },
      deep: true
    }
  },
  async created() {
    await this.getOrderFiledMap()
    await this.getProjectSwitch('system', 'project')
    await this.getProductNameSwitch('product', 'enable_productName')
    await this.getProportionSwitch('warehouse', 'proportion')
    this.getBimBusinessDetail()
    await this.getDeputyUnit()
    await this.switchStyleheight()
    this.formLoading = false
    // this.handleChange()
    // this.getProvinceList()
    this.getAttributeline()
    this.getWarehouseList()
  },
  mounted() {
    let tBody = document.querySelectorAll('.el-table')[1]
    tBody.style.height = 'auto'
    tBody.querySelector('.el-table__body-wrapper').style.height = 'auto'
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
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 420
      console.log(maxHeight, 'maxHeight')
      if (this.btnType === 'look') {
        this.customStyleData = maxHeight + 40
      } else {
        this.customStyleData = maxHeight
      }
      
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100)
      }
    },
    getOrderFiledMap() {
      getOrderFiledMap('purchase').then((res) => {
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
        this.processFlag = res.data.process
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    async getProportionSwitch(code, type) {
      try {
        this.isProportionSwitch = await this.jnpf.getMainUnitFun(code, type)
      } catch (error) { }
    },
    warehouseIdChange(e) {
      this.dataForm.warehouseId = e
      if (this.isProjectSwitch === '1') {
        this.warehouseIdList.forEach((item) => {
          if (e === item.id) {
            this.orderForm.projectId = item.projectId
          }
        })
        this.dataFormTwo.productData = this.dataFormTwo.productData.filter(
          (item) => item.projectId === this.orderForm.projectId
        )
      }
    },
    getDeputyUnit() {
      let obj = {
        businessCode: 'deputyUnit',
        configKey: `procureDeputyUnit`
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isDeputyUnitSwitch = res.data.configValue1
      })
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_cgshd'
      }
      getBimBusinessDetail(obj).then((res) => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    scanFun() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
      this.scanDialog = true
      this.$nextTick(() => {
        this.$refs.inputRef.$refs.input.focus()
      })
    },
    closeScanDiaFun() {
      this.scanDialog = false
      this.scanResult = ''
      this.orderForm.productCode = ''
    },
    getProductFun() {
      console.log(21341234)
      console.log(this.scanResult)
      if (this.deliveryDateArr.length) {
        this.orderForm.deliveryStartTime = this.deliveryDateArr[0]
        this.orderForm.deliveryEndTime = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartTime = ''
        this.orderForm.deliveryEndTime = ''
      }
      this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
      this.orderForm.productCode = this.scanResult
      detailpurchaseOrderList(this.orderForm).then((res) => {
        console.log(res.data.records, 'p')
        this.scanResult = ''
        console.log(this.dataFormTwo.productData, 'this.dataFormTwo.productData')
        const newRecord = res.data.records

        if (newRecord.length !== 0) {
          if (!this.dataFormTwo.productData || this.dataFormTwo.productData.length == 0) {
            this.dataFormTwo.productData = newRecord
          } else {
            // 使用 Map 来确保唯一性并更新对象
            const mergedMap = new Map()

            this.dataFormTwo.productData.forEach((item) => mergedMap.set(item.id, item))

            newRecord.forEach((item) => mergedMap.set(item.id, item))

            this.dataFormTwo.productData = Array.from(mergedMap.values())
          }
        } else {
          this.$message({
            message: '未匹配到产品',
            type: 'warning'
          })
          this.scanResult = ''
        }
      })
    },
    getWarehouseList() {
      let obj = {
        type: 'virtually',
        category: 'warehouse'
      }
      if (this.isProjectSwitch === '1') {
        obj.projectId = this.userInfo.projectId
      }
      getWarehouseList(obj).then((res) => {
        this.warehouseIdList = res.data
      })
    },
    //发货数量不能为0
    calcValidatenum() {
      return (rule, value, callback) => {
        console.log(value, 'oo999')
        let msg = `收货数量不能为'0'`
        if (value == 0) {
          callback(new Error(msg)), this.$message.error(msg)
        }
        if (!value) {
          callback(new Error(msg)), this.$message.error(msg)
        }
      }
    },
    //数量验证
    // list 中 a 不能 operator b 的校验规则
    calcValidate() {
      console.log(12332222)
      return (rule, value, callback) => {
        console.log(value, 'p')
        let index = Number(rule.field.match(/\d+/)[0])
        let msg = this.dataForm.exchangeGoodsFlag ? `换货数量超过最大可换货数量` : `收货数量超过最大可收货数量`
        if (!value || value == 0) {
          callback()
        } else {
          let flag = false
          let list = this.dataFormTwo.productData
          let num_1 = Number(list[index].receivedQuantity)
          let num_2 = Number(list[index].waitReceiptNum)

          if (!(num_1 <= num_2)) {
            flag = true
          }
          if (flag) {
            this.$message.error(`第${index + 1}行${msg}`)
            callback(new Error(msg))
          } else {
            callback()
          }
        }
      }
    },

    // 产品列表选中
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i]
        const index = this.dataFormTwo.productData.indexOf(row)
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1) // 从tableData中删除选中的行
        }
      }
      this.selectRows = [] // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      if (this.btnType == 'qrsh') {
        if (this.dataFormTwo.productData.length > 1) {
          this.dataFormTwo.productData.splice(data.$index, 1)
        } else {
          this.$message({
            message: '已是最后一条数据',
            type: 'error',
            duration: 1500
          })
        }
      } else {
        this.dataFormTwo.productData.splice(data.$index, 1)
      }
    },

    // 选择产品——搜索
    searchProductFun() {
      if (this.deliveryDateArr.length) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0]
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1]
      } else {
        this.orderForm.deliveryStartDate = ''
        this.orderForm.deliveryEndDate = ''
      }
      this.orderForm.cooperativePartnerId = this.dataForm.cooperativePartnerId
      detailpurchaseOrderList(this.orderForm)
        .then((res) => {
          this.productList = res.data.records
          this.productTotal = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    // 选择产品——重置
    resetProductFun() {
      this.deliveryDateArr = []
      this.orderForm = {
        cooperativePartnerCode: '',
        cooperativePartnerName: '',
        createByName: '',
        deliveryEndDate: '',
        deliveryStartDate: '',
        receiptQueryFlag: 1,
        endTime: '',
        orderNo: '',
        orderType: 'procure',
        orderItems: [
          {
            asc: false,
            column: 'createTime'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: '',
        productCode: '',
        productName: '',
        classAttribute: 'other',
        receivingStatus: 'receiving'
      }
      this.searchProductFun()
    },
    // 点击选择产品
    openSeleceProductDialog() {
      if (!this.dataForm.cooperativePartnerId) return this.$message.error('请先选择供应商')
      this.productVisible = true
      this.searchProductFun()
    },
    submitAllProduct() {
      if (this.selectArr.length == 0) return this.$message.error('请选择产品！')
      this.productVisible = false
      this.selectArr.forEach((item) => {
        this.$set(item, 'receivedQuantity', item.waitReceiptNum)
        this.dataFormTwo.productData.push(item)
      })
      let uniqueArr = []
      let idSet = new Set()

      this.dataFormTwo.productData.forEach((item) => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item)
          idSet.add(item.id)
        }
      })
      this.dataFormTwo.productData = uniqueArr
    },
    // },
    // 获取所有订单列表数据
    initData2() {
      this.ProductListRequestObj.cooperativePartnerCode = this.code ? this.code : this.dataForm.partnerCode
      this.listLoading = true
      getsaleOrderList(this.ProductListRequestObj).then((listRes) => {
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
      if (this.orderDateArr && this.orderDateArr.length > 0) {
        this.ProductListRequestObj.orderStartDate = this.orderDateArr[0]
        this.ProductListRequestObj.orderEndDate = this.orderDateArr[1]
      } else {
        this.ProductListRequestObj.orderStartDate = ''
        this.ProductListRequestObj.orderEndDate = ''
      }
      this.initData2()
    },
    // 监听主数量输入
    watchnums(row, index) {
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
      if (!row.receivedQuantity) {
        return
      }
      row.receivedQuantity = row.receivedQuantity.replace(/[^0-9.]/g, '')

      if (row.receivedQuantity.length == 1 && row.receivedQuantity == '.') {
        // 如果第一位是小数点，则清空输入框
        row.receivedQuantity = ''
      } else if (row.receivedQuantity.length == 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        // 如果第一位是0，第二位不是小数点，则在第二位后面插入小数点
        row.receivedQuantity = row.receivedQuantity.slice(0, 1) + '.' + row.receivedQuantity.slice(1)
      } else if (row.receivedQuantity.length > 2 && row.receivedQuantity[0] == '0' && row.receivedQuantity[1] != '.') {
        row.receivedQuantity = row.receivedQuantity.substring(1, row.receivedQuantity.length)
      }
      if (row.receivedQuantity.includes('.')) {
        let dotCount = 0 // 小数点的数量
        let result = '' // 处理后的结果
        for (let i = 0; i < row.receivedQuantity.length; i++) {
          const char = row.receivedQuantity[i]
          if (char === '.') {
            if (dotCount === 0) {
              // 第一个小数点保留
              result += char
              dotCount++
            }
          } else {
            result += char
          }
        }
        row.receivedQuantity = result
        let arr = row.receivedQuantity.split('.')
        if (arr[0].length > 8) {
          arr[0] = arr[0].substring(0, 8)
        }
        if (arr[1].length > 2) {
          arr[1] = arr[1].substring(0, 2)
        }
        row.receivedQuantity = arr[0] + '.' + arr[1]
      } else {
        if (row.receivedQuantity.length > 8) {
          row.receivedQuantity = row.receivedQuantity.substring(0, 8)
        }
      }
    },
    // 所有产品弹框 重置搜索条件
    resetAllProduct() {
      this.orderDateArr = []
      this.ProductListRequestObj = {
        // neOrderState: 'finish',
        orderNo: '',
        cooperativePartnerName: '',
        orderType: '',
        salesName: '',
        workOrderNo: '',
        sourceOrderNo: '',
        orderStartDate: '',
        orderEndDate: '',
        contractNo: '',
        deliveryStartDate: '',
        deliveryEndDate: '',
        distributeStatus: 'distributed',
        // orderCategory: "assembly",
        shipmentStatus: '',
        orderState: '',
        productionStatus: '',
        documentStatus: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ]
      }
      this.searchAllProduct()
    },
    handleSelectionChangeAllPruduct(val) {
      this.selectArr = val
    },
    // 获取产品列表字段 编排属性
    getAttributeline() {
      getAttributeline('product').then((res) => {
        this.attributeLines = res.data
      })
    },

    // 选完所属采购，带出所属部门
    hangleSelectSales(e, r) {
      this.dataForm.departmentId = r.parentId
      this.dataForm.departmentName = r.organize
    },
    handleClose() {
      this.form = {
        code: '',
        name: '',
        taxId: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      }
      this.initData()
    },
    // 选择客户
    seleceCustomer(e) {
      getCooperativeInfo(e.id).then((res) => {
        if (this.dataForm.cooperativePartnerId && res.msg == 'Success') {
          this.$confirm('切换供应商后将清空订单和产品信息，是否继续！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '切换成功'
              })
              // this.dataForm = {
              //   exchangeGoodsFlag: false,
              //   // orderCategory: "assembly",
              //   returnDeliveryType: 'back',
              //   notificationType: 'procure',
              //   logisticsCompany: '',
              //   ordersId: '',
              //   deliverDate: '',
              //   logisticsNumber: '',
              //   cooperativePartnerId: '',
              //   remark: '',
              //   orderNo: this.codeConfig.number
              // }
              this.dataFormTwo.productData = []
              this.customerData = e
              this.dataForm.cooperativePartnerId = e.id
              this.ProductListRequestObj.cooperativePartnerCode = e.code
              this.code = e.code
              this.dataForm.partnerName = e.name
              this.dataForm.code = e.code
              this.customerVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
              this.customerVisible = true
            })
        } else {
          // this.$nextTick(() => { this.$refs['dataForm'].validateField('cooperativePartnerId') })
          // this.dataForm = {
          //   exchangeGoodsFlag: false,
          //   // orderCategory: "assembly",
          //   returnDeliveryType: 'back',
          //   notificationType: 'procure',
          //   logisticsCompany: '',
          //   ordersId: '',
          //   orderNo: this.codeConfig.number,
          //   deliverDate: '',
          //   logisticsNumber: '',
          //   cooperativePartnerId: '',
          //   remark: ''
          // }
          this.dataFormTwo.productData = []
          this.customerData = e
          this.dataForm.cooperativePartnerId = e.id
          this.ProductListRequestObj.cooperativePartnerCode = e.code
          this.code = e.code
          this.dataForm.partnerName = e.name
          this.dataForm.code = e.code
          this.customerVisible = false
        }
      })
    },
    computedNumFun(data, index) {
      if (data.proportion && data.weight) {
        this.dataFormTwo.productData[index].receivedQuantity = Math.floor(data.proportion * data.weight * data.discount)
        this.watchNum(data, index)
      }
    },
    search() {
      this.form.pageNum = 1
      this.initData()
    },
    reset() {
      this.form = {
        code: '',
        taxId: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: '',
        type: 'supplier'
      }
      this.getcategoryTree()
    },
    initData() {
      this.listLoading = true
      getCooperativeData(this.form)
        .then((res) => {
          this.tableDataCustomer = res.data.records
          this.total = res.data.total
          this.listLoading = false
          this.visible = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data, node) {
      if (this.form.partnerCategoryId === data.id) return
      this.form.partnerCategoryId = data.id
      const nodePath = this.getNodePath(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
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
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeAllProduct(data, node) {
      if (this.ProductListRequestObj.productCategoryId === data.id) return
      this.ProductListRequestObj.productCategoryId = data.hasOwnProperty('parentId') ? data.id : ''
      const nodePath = this.getNodePathProduct(node)
      this.organizeIdTree = nodePath.map((o) => o.id)
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
        type: 'supplier'
      }
      getcategoryTrees(listQuery)
        .then((res) => {
          this.treeData = res.data
          this.$nextTick(() => {
            this.initData()
            this.treeLoading = false
          })
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    // 打开选择客户弹框
    openDialog() {
      this.customerVisible = true
      this.getcategoryTree()
    },
    // 切换table
    handleClick(tab, event) { },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        this.dataForm.orderNo = data.number
        this.$set(this.dataForm, 'orderNo', data.number)
      } catch (error) { }
    },
    init(id, btnType, approvalFlag, data) {
      console.log(id, '[]')
      this.dataForm.id = id || ''

      this.btnType = btnType
      console.log(btnType, 'iiiiii')
      this.approvalFlag = approvalFlag
      console.log(data, 'ddd')
      if(data!='outInboundWarehouse'){

        if (data && data.length) {
          this.dataFormTwo.productData = data
          this.dataForm.partnerName = data[0].cooperativePartnerName
          this.dataForm.cooperativePartnerId = data[0].cooperativePartnerId
          data.forEach((item) => {
            console.log('ooooooo', item)
            item.ordersNo = item.orderNo
            this.$set(item, 'receivedQuantity', item.waitReceiptNum)
            this.$set(item, 'discount', 1)
          })
        }
      }
      if (this.dataForm.id) {
        getpurPurchaseReceiptReturnGoodsdetail(this.dataForm.id).then((res) => {
          this.dataForm = res.data.notice

          if (this.btnType == 'copy') {
            this.dataForm.inspectionStatus = ''
            this.dataForm.id = ''
            this.dataForm.deliverDate = this.jnpf.getToday()
            this.datafilelist = []
            this.dataForm.approvalStatus = ''
            this.dataForm.packingStatus = 'unboxed'
            this.dataForm.salesman = this.userInfo.userName
            this.fetchData('CGSH')
            this.getBusInfo()

            res.data.noticeLineList.forEach((item) => {
              item.receivedQuantity = ''
            })
          } else if (this.btnType == 'edit' || this.btnType == 'look') {
            let data = res.data.noticeLineList
            data.forEach((item) => {
              console.log('ooo888oooo', item)
              item.drawingNo = item.productDrawingNo
            })
            this.dataFormTwo.productData = data

            if (this.btnType === 'edit') {
              this.getBusInfo()
            } else {
              // 流程信息和流转记录
              console.log(this.dataForm.approvalFlag, 'this.dataForm.approvalFlag666')
              if (this.dataForm.approvalFlag) this.getFlowDetail(this.dataForm.id)
            }
          }
          if (res.data.attachmentList.length !== 0) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push({
                name: item.document.fullName,
                fileSize: item.document.fileSize,
                filename: item.document.filePath,
                id: item.document.id,
                url: item.url
              })
            })
          }
        })
      } else {
        this.dataForm.salesman = this.userInfo.userName
        this.dataForm.deliverDate = this.jnpf.getToday()
        this.fetchData('CGSH')
        this.getBusInfo()
      }
      if (this.btnType == 'edit') {
        this.btnText = '继续修改'
        this.getBusInfo()
      } else if (this.btnType == 'add' || this.btnType == 'copy') {
        this.btnText = '继续新增'
        console.log(6)
        this.getBusInfo()
      }
    },

    goBack() {
      this.$emit('close', true)
    },
    // 继续修改
    continueEdit() {
      this.init(this.oldId, this.oldType)
      this.tipsvisible = false
      this.btnLoading = false
    },
    // 继续新增
    continueAdd() {
      this.dataFormTwo.productData = []
      this.dataForm = {
        exchangeGoodsFlag: false,
        inspectionStatus: '',
        // orderCategory: "assembly",
        // returnDeliveryType: 'back',
        // notificationType: 'procure',
        logisticsCompany: '',
        ordersId: '',
        deliverDate: '',
        partnerName: '',
        orderNo: '',
        logisticsNumber: '',
        //   phone: '',
        //   country: '',
        //   province: '',
        //   city: '',
        //   area: '',
        //   address: '',
        //   delivery: '',
        //   shipperId: '',
        cooperativePartnerId: '',
        remark: '',
        approvalFlag: false
      }
      this.$refs.dataForm.resetFields()
      this.init('', 'add')
      this.tipsvisible = false
      this.btnLoading = false
    },
    handleConfirm(value, type) {
      let submitFlag = true
      console.log(this.$refs['dataForm'])
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (!valid) {
          submitFlag = false
          this.btnLoading = false
        }
      })
      console.log(this.$refs['productForm'], 'kkkk')
      this.$refs['productForm'].validate((valid) => {
        console.log(valid, 'p999')
        if (!valid) {
          submitFlag = false
          this.btnLoading = false
        }
      })
      if (submitFlag) {
        if (this.datafilelist.length) {
          this.datafilelist.map((item, index) => {
            item.bimAttachments = {
              businessType: 'system_attachment',
              configKey: 'fj_cgshd',
              categoryId: this.categoryId,
              documentId: item.id,
              fileFlag: '',
              sort: index
            }
          })
        }
        // this.dataForm.classAttribute = 'finish_product'
        this.dataForm.receiptReturnType = 'receipt'
        let obj = {
          attachmentList: this.datafilelist,
          returnGoods: this.dataForm,
          lines: [],
          flowData: this.flowData
        }
        if (!this.dataFormTwo.productData.length) {
          this.$message({
            message: '请选择产品',
            type: 'error',
            duration: 1500
          })
          return
        }
        for (let index = 0; index < this.dataFormTwo.productData.length; index++) {
          const item = this.dataFormTwo.productData[index]
          console.log(item.purchaseQuantity, 'item')
          console.log(item.productsId, 'item')
          if (!item.receivedQuantity && item.productsId) {
            submitFlag = false
            this.btnLoading = false
            this.$message({
              message: '请输入第' + (index + 1) + '行产品的收货数量',
              type: 'error',
              duration: 1500
            })
            break
          }
          if (Number(item.receivedQuantity) == 0) {
            submitFlag = false
            this.btnLoading = false
            this.$message({
              message: '第' + (index + 1) + '行产品的收货数量必须大于0',
              type: 'error',
              duration: 1500
            })
            break
          }
        }

        this.dataFormTwo.productData.forEach((item, index) => {
          let dep = {
            accuracyLevel: item.accuracyLevel,
            billStatus: item.billStatus,
            calculationDirection: item.calculationDirection,
            clearance: item.clearance,
            customColumn: item.customColumn,
            deputyUnit: item.deputyUnit,
            // id: 0,
            notificationType: 'procure',
            inspectionResults: item.inspectionResults,
            mainUnit: item.mainUnit,
            // notificationType: item.notificationType,
            oil: item.oil,
            oilQuantity: item.oilQuantity,
            weight: item.weight,
            proportion: item.proportion,
            discount: item.discount,
            packagingMethod: item.packagingMethod,
            packingQuantity: item.packingQuantity,
            processId: item.processId,
            productsId: item.productsId ? item.productsId : '',
            purchaseOrderId: item.purchaseOrderId,
            purchaseQuantity: item.purchaseQuantity,
            purchaseQuantity2: item.purchaseQuantity2,
            purchaseReceiptReturnGoodsId: item.purchaseReceiptReturnGoodsId,
            qualifiedQuantity: item.qualifiedQuantity,
            ratio: item.ratio,
            waitReceiptNum: item.waitReceiptNum,
            receivedQuantity: item.receivedQuantity,
            receivingStatus: item.receivingStatus,
            remark: item.remark,
            sealingCoverTyping: item.sealingCoverTyping,
            standardValue: item.standardValue,
            unqualifiedQuantity: item.unqualifiedQuantity,
            vibrationLevel: item.vibrationLevel,
            warehouseId: item.warehouseId,
            ordersId: item.ordersId,
            classAttribute: item.classAttribute,
            id: item.id ? item.id : '',
            // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
            ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
            // pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
            ratio: item.ratio ? item.ratio : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            remark: item.remark ? item.remark : '',
            purchaseReceiptReturnGoodsId: this.dataForm.id ? this.dataForm.id : '',
            receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
            price: item.price ? item.price : '',
            totalAmount: item.totalAmount ? item.totalAmount : '',
            taxRate: item.taxRate ? item.taxRate : '',
            excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : '',
            taxAmount: item.taxAmount ? item.taxAmount : '',
            excludingTaxAmount: item.excludingTaxAmount ? item.excludingTaxAmount : ''
          }
          let dep1 = {
            billStatus: item.billStatus ? item.billStatus : '',
            calculationDirection: item.calculationDirection ? item.calculationDirection : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            deputyUnit: item.deputyUnit ? item.deputyUnit : '',
            mainUnit: item.mainUnit ? item.mainUnit : '',
            ordersId: item.ordersId,
            classAttribute: item.classAttribute,
            id: item.id ? item.id : '',
            purchaseQuantity: item.purchaseQuantity,
            purchaseQuantity2: item.purchaseQuantity2,
            productsId: item.productsId ? item.productsId : '',
            waitReceiptNum: item.waitReceiptNum ? item.waitReceiptNum : '',
            // outboundQuantity: item.outboundQuantity ? item.outboundQuantity : '',
            ordersLineId: item.ordersLineId ? item.ordersLineId : item.id,
            pickingQuantity: item.pickingQuantity ? item.pickingQuantity : '',
            ratio: item.ratio ? item.ratio : '',
            receivedQuantity: item.receivedQuantity ? item.receivedQuantity : '',
            remark: item.remark ? item.remark : '',
            purchaseReceiptReturnGoodsId: this.dataForm.id ? this.dataForm.id : '',
            receivingQuantity: item.receivingQuantity ? item.receivingQuantity : '',
            price: item.price ? item.price : '',
            totalAmount: item.totalAmount ? item.totalAmount : '',
            taxRate: item.taxRate ? item.taxRate : '',
            excludingTaxPrice: item.excludingTaxPrice ? item.excludingTaxPrice : '',
            taxAmount: item.taxAmount ? item.taxAmount : '',
            excludingTaxAmount: item.excludingTaxAmount ? item.excludingTaxAmount : '',
            weight: item.weight,
            proportion: item.proportion,
            discount: item.discount
          }
          if (this.btnType == 'add' || this.btnType == 'copy') {
            obj.lines.push(dep)
          } else {
            obj.lines.push(dep1)
          }
        })
        this.btnLoading = true
        let formMethod = null

        if (this.btnType == 'edit') {
          formMethod = editpurPurchaseReceiptReturnGoods
        } else if (this.btnType == 'add' || this.btnType == 'copy') {
          // obj.notice.deliveryStatus = 'not_returned'
          formMethod = addpurPurchaseReceiptReturnGoods
        }
        console.log(obj, 'obj')
        formMethod(obj)
          .then((res) => {
            // let msg = "";
            // if (formMethod == addpurPurchaseReceiptReturnGoods) {
            //   msg = "新建成功"
            // } else if (value == 'draft') {
            //   msg = "保存成功"
            // } else if (value == 'submit') {
            //   msg = '提交成功'
            // }
            if (value == 'draft') {
              this.submitmethodsTitle = '保存成功'
            } else if (value == 'submit') {
              this.submitmethodsTitle = '提交成功'
            }
            if (type) {
              this.enCode = 'p018'
              this.formId = res.data.id
              this.fullName = '采购收货单'

              this.printVisible = true
              this.$nextTick(() => {
                this.$refs.printTemplate.init(this.enCode)
              })
            } else {
              this.tipsvisible = true
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
          })
          .catch(() => {
            this.btnLoading = false
          })
      }
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode)
        .then((res) => {
          if (res.data) {
            this.printVisible = false
            this.prindId = res.data.id
            this.printBrowseVisible = true
          } else {
            this.$message.warning('未找到相应打印模版')
          }
        })
        .catch(() => {
          this.printBrowseVisible = false
        })
    },
    closePrint() {
      this.btnLoading = false
      this.printVisible = false
    },
    // 测试审批流
    getBusInfo() {
      getBusinessFlowInfo('b034')
        .then((res) => {
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
        })
        .catch(() => { })
    },
    // 流程信息 && 流转记录
    getFlowDetail(id) {
      getBusinessFlowDetail(id)
        .then((res) => {
          if (res.data) {
            this.flowTemplateJson = res.data.flowTaskInfo.flowTemplateJson
              ? JSON.parse(res.data.flowTaskInfo.flowTemplateJson)
              : null
            this.flowTaskOperatorRecordList = res.data.flowTaskOperatorRecordList
            this.endTime = res.data.flowTaskInfo.completion == 100 ? res.data.flowTaskInfo.endTime : 0
            let flowTaskNodeList = res.data.flowTaskNodeList
            if (flowTaskNodeList.length) {
              for (let i = 0; i < flowTaskNodeList.length; i++) {
                const nodeItem = flowTaskNodeList[i]
                const loop = (data) => {
                  if (Array.isArray(data)) data.forEach((d) => loop(d))
                  if (data.nodeId === nodeItem.nodeCode) {
                    if (nodeItem.type == 0) data.state = 'state-past'
                    if (nodeItem.type == 1) data.state = 'state-curr'
                    if (
                      nodeItem.nodeType === 'approver' ||
                      nodeItem.nodeType === 'start' ||
                      nodeItem.nodeType === 'subFlow'
                    )
                      data.content = nodeItem.userName
                    return
                  }
                  if (data.conditionNodes && Array.isArray(data.conditionNodes)) loop(data.conditionNodes)
                  if (data.childNode) loop(data.childNode)
                }
                loop(this.flowTemplateJson)
              }
            }
          }
        })
        .catch(() => { })
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      //在数据加载完，重新渲染表格
      this.$refs['product'].doLayout()
    })
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

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}
</style>
<style scoped>
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
</style>
<style lang="scss" scoped>
$footerPadding: '10px';

::v-deep.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.selectPro.JNPF-dialog_center .el-dialog .el-dialog__body {
  padding: 0 10px !important;
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
  // padding: 10px;
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

::v-deep .el-tabs__header {
  margin-bottom: 5px;
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
