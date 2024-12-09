<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="$emit('close')"
          :content="btnType == 'add' ? '新建销售报价' : btnType == 'edit' ? '编辑销售报价' : btnType == 'custom' ? '生成客户产品' : btnType == 'bjkh' ? '编辑客户产品' : '查看销售报价'" />
        <div class="options" v-if="btnType !== 'look'">
          <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')"
            v-if="btnType == 'add' || btnType == 'edit'">
            保存草稿</el-button>
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="main" :element-loading-text="loadingText">
        <el-tabs v-model="activeName">
          <el-tab-pane label="订单信息" name="orderInfo" class="orderInfo">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24" v-if="btnType == 'look' && dataForm.documentStatus != 'draft'">
                  <el-form-item label="报价单号" prop="quotationNo">
                    <el-input v-model="dataForm.quotationNo" placeholder="输入报价单号" :disabled="status" maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="致" prop="deliver">
                    <el-input v-model="dataForm.deliver" placeholder="输入致" :disabled="status" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <!-- 客户产品未生成 并且 打开方式非生成客户产品 -->
                  <el-form-item label="意向客户" prop="yxCooperativePartnerIdText"
                    v-if="!dataForm.generateFlag && btnType !== 'custom'">
                    <ComSelect-page key="yxPartner" ref="ComSelect-page" v-model="dataForm.yxCooperativePartnerIdText"
                      @change="yxPartnerChange" :tableItems="yxPartnerTableItems" dialogTitle="选择意向客户" treeTitle="意向客户分类"
                      placeholder="请选择意向客户"
                      :methodArr="{ method: getcategoryTree, requestObj: { type: 'public_private_sea' } }"
                      :listMethod="getPrivateList" :listRequestObj="yxPartnerRequestObj" :searchList="yxPartnerSearchList"
                      :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="status" />
                  </el-form-item>
                  <el-form-item label="客户" prop="cooperativePartnerIdText" v-else>
                    <ComSelect-page key="partner" ref="ComSelect-page" v-model="dataForm.cooperativePartnerIdText"
                      @change="partnerChange" :tableItems="partnerTableItems" dialogTitle="选择客户" treeTitle="客户分类"
                      placeholder="请选择客户" :methodArr="{ method: getcategoryTrees, requestObj: { type: 'customer' } }"
                      :listMethod="getCooperativeData" :listRequestObj="partnerRequestObj" :searchList="partnerSearchList"
                      :treeNodeClick="yxPartnerTreeNodeClick" :isdisabled="btnType === 'look'" />
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
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h5>产品信息</h5>
            </div>
            <div v-if="btnType == 'add' || btnType == 'edit'">
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look'" @click="addtable()">添加产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look'" @click="addtable('product')">导入产品</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-plus"
                :disabled="btnType == 'look'" @click="addtable('price')">导入获取牌价</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                icon="el-icon-download" :disabled="btnType == 'look'" @click="downLoadTemplate">下载模板</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important"
                :disabled="btnType == 'look'" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px ;font-size:14px!important" icon="el-icon-download"
                :disabled="btnType == 'look'" @click="exportPrice()">导出无价格</el-button>|
            </div>
            <el-button v-else-if="btnType == 'custom'" type="text"
              style="margin-right:8px;margin-left:8px ;font-size:14px!important" :disabled="btnType == 'look'"
              icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
            <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
              <el-table ref="product" :data="dataFormTwo.lines" @selection-change="handeleProductInfoData"
                v-if="tableVisible" v-bind="customStyleData">
                <el-table-column type="selection" width="60" fixed='left' align="center"
                  v-if="iszt || this.btnType === 'custom'" key="1" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed='left' />
                <el-table-column prop="customerDrawingNumber" label="客户物料号" width="200" fixed='left'>
                  <template slot="header">
                    <span class="required">*</span>客户物料号
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerDrawingNumber'"
                      :rules='productRules.customerDrawingNumber'>
                      <el-input v-model="scope.row.customerDrawingNumber" placeholder="请输入客户物料号" :disabled="status"
                        maxlength="500" style="width: 175px;" @blur="blurSpec(scope.row, scope.$index)" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="customerProductDrawingNo" label="客户图号" width="200" fixed='left'>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'customerProductDrawingNo'"
                      :rules='productRules.customerProductDrawingNo'>
                      <el-input v-model="scope.row.customerProductDrawingNo" placeholder="请输入客户图号" :disabled="status"
                        maxlength="1000" style="width: 175px;" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="materialDescription" label="物料描述" width="170">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.materialDescription" placeholder="请输入物料描述" :disabled="status"
                      maxlength="100" style="width: 145px;" />
                  </template>
                </el-table-column>
                <el-table-column prop="spec" label="规格型号" width="400">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.spec" placeholder="请输入规格型号" :disabled="status" maxlength="100"
                      style="width: 100%;" @blur="blurSpec(scope.row, scope.$index)" />
                  </template>
                </el-table-column>
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
                <el-table-column prop="listPrice" label="牌价(含税)" width="160">
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'listPrice'" :rules="dataForm.documentStatus === 'draft' ? false : productRules.listPrice">
                      <el-input v-model="scope.row.listPrice" placeholder="牌价自动生成" disabled maxlength="20"
                        style="width: 135px;">
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
                        @input="watchnums(scope.row, scope.$index)" style="width: 135px;"
                        oninput="value=value.replace(/[^0-9.]/g,'')">
                      </el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="excludingTaxUnitPrice" label="单价(不含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="discount" label="折扣率(%)" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="amounts" label="金额(含税)" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="excludingTaxAmounts" label="金额(不含税)" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="totalTaxAmount" label="总税额" width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="140">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.mainUnit" placeholder="请输入单位" :disabled="status" maxlength="20"
                      style="width: 115px;" />
                  </template>
                </el-table-column>
                <el-table-column prop="taxRate" label="税率(%)" width="160">
                  <template slot="header">
                    <span class="required">*</span>税率(%)
                  </template>
                  <template slot-scope="scope">
                    <el-form-item :prop="'lines.' + scope.$index + '.' + 'taxRate'" :rules='productRules.taxRate'>
                      <el-input v-model="scope.row.taxRate" placeholder="请输入税率" :disabled="status" maxlength="2"
                        style="width: 135px;" oninput="value=value.replace(/[^0-9.]/g,'')"
                        @input="watchnums(scope.row, scope.$index)" />
                    </el-form-item>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注1" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark" placeholder="请输入备注2" :disabled="status" maxlength="200" />
                  </template>
                </el-table-column>
                <el-table-column prop="remark2" label="备注2" min-width="200">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.remark2" placeholder="请输入备注2" :disabled="status" maxlength="200" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right"
                  v-if="btnType == 'add' || btnType == 'edit' || btnType == 'custom'">
                  <template slot-scope="scope" v-if="btnType != 'look'">
                    <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                  </template>
                </el-table-column>
                <!-- <el-table-column align="center" fixed="right" width="40">
                  <template slot="header">
                    <el-tooltip content="切换展示模式" placement="top">
                      <el-link icon="el-icon-sort" :underline="false" @click="switchStyle" />
                    </el-tooltip>
                  </template>
                </el-table-column> -->
              </el-table>
              <div style="height: 40px; line-height: 40px;background: #f5f7fa;" class="text">
                <span style="font-weight:500;margin:0 10px">总数量：{{ totalNum }}</span>
                <span style="font-weight:500;margin:0 10px">总金额：{{ totalPrice }}</span>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="btnType == 'look'" :detailed="btnType == 'look'"></UploadWj>
          </el-tab-pane>
          <el-tab-pane label="流程信息" name="approvalFlow">
            <workFlow v-if="workVisible" :nodeFirst="firstOneNode" :btnType="btnType" :nodeConfig.sync="busNodeConfig"
              ref="workflowRef" />
            <div class="noDataTip" v-if="!workVisible">
              <span class="el-table__empty-text">
                <div data-v-4d190d64="" class="el-empty">
                  <div class="el-empty__image" style="width: 120px;"><svg viewBox="0 0 79 86" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <defs>
                        <linearGradient id="linearGradient-1-48" x1="38.8503086%" y1="0%" x2="61.1496914%" y2="100%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#EEEFF3" offset="100%"></stop>
                        </linearGradient>
                        <linearGradient id="linearGradient-2-48" x1="0%" y1="9.5%" x2="100%" y2="90.5%">
                          <stop stop-color="#FCFCFD" offset="0%"></stop>
                          <stop stop-color="#E9EBEF" offset="100%"></stop>
                        </linearGradient>
                        <rect id="path-3-48" x="0" y="0" width="17" height="36"></rect>
                      </defs>
                      <g id="Illustrations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="B-type" transform="translate(-1268.000000, -535.000000)">
                          <g id="Group-2" transform="translate(1268.000000, 535.000000)">
                            <path id="Oval-Copy-2"
                              d="M39.5,86 C61.3152476,86 79,83.9106622 79,81.3333333 C79,78.7560045 57.3152476,78 35.5,78 C13.6847524,78 0,78.7560045 0,81.3333333 C0,83.9106622 17.6847524,86 39.5,86 Z"
                              fill="#F7F8FC"></path>
                            <polygon id="Rectangle-Copy-14" fill="#E5E7E9"
                              transform="translate(27.500000, 51.500000) scale(1, -1) translate(-27.500000, -51.500000) "
                              points="13 58 53 58 42 45 2 45"></polygon>
                            <g id="Group-Copy"
                              transform="translate(34.500000, 31.500000) scale(-1, 1) rotate(-25.000000) translate(-34.500000, -31.500000) translate(7.000000, 10.000000)">
                              <polygon id="Rectangle-Copy-10" fill="#E5E7E9"
                                transform="translate(11.500000, 5.000000) scale(1, -1) translate(-11.500000, -5.000000) "
                                points="2.84078316e-14 3 18 3 23 7 5 7"></polygon>
                              <polygon id="Rectangle-Copy-11" fill="#EDEEF2"
                                points="-3.69149156e-15 7 38 7 38 43 -3.69149156e-15 43"></polygon>
                              <rect id="Rectangle-Copy-12" fill="url(#linearGradient-1-48)"
                                transform="translate(46.500000, 25.000000) scale(-1, 1) translate(-46.500000, -25.000000) "
                                x="38" y="7" width="17" height="36"></rect>
                              <polygon id="Rectangle-Copy-13" fill="#F8F9FB"
                                transform="translate(39.500000, 3.500000) scale(-1, 1) translate(-39.500000, -3.500000) "
                                points="24 7 41 7 55 -3.63806207e-12 38 -3.63806207e-12"></polygon>
                            </g>
                            <rect id="Rectangle-Copy-15" fill="url(#linearGradient-2-48)" x="13" y="45" width="40"
                              height="36"></rect>
                            <g id="Rectangle-Copy-17" transform="translate(53.000000, 45.000000)">
                              <mask id="mask-4-48" fill="white">
                                <use xlink:href="#path-3-48"></use>
                              </mask>
                              <use id="Mask" fill="#E0E3E9"
                                transform="translate(8.500000, 18.000000) scale(-1, 1) translate(-8.500000, -18.000000) "
                                xlink:href="#path-3-48"></use>
                              <polygon id="Rectangle-Copy" fill="#D5D7DE" mask="url(#mask-4-48)"
                                transform="translate(12.000000, 9.000000) scale(-1, 1) translate(-12.000000, -9.000000) "
                                points="7 0 24 0 20 18 -1.70530257e-13 16"></polygon>
                            </g>
                            <polygon id="Rectangle-Copy-18" fill="#F8F9FB"
                              transform="translate(66.000000, 51.500000) scale(-1, 1) translate(-66.000000, -51.500000) "
                              points="62 45 79 45 70 58 53 58"></polygon>
                          </g>
                        </g>
                      </g>
                    </svg></div>
                  <div class="el-empty__description">
                    <p>暂无流程信息</p>
                  </div><!---->
                </div>
              </span>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="btnType == 'look'" label="流转记录" name="transferList">
            <el-table v-loading="formLoading" :data="transferData">
              <el-table-column prop="businessName" label="审批业务名称" min-width="160" />
              <el-table-column prop="processedName" label="办理人名称" min-width="160" />
              <el-table-column prop="remark" label="备注" min-width="160" />
              <el-table-column prop="startDate" label="开始时间" min-width="160" />
              <el-table-column prop="endDate" label="结束时间" min-width="160" />
              <el-table-column prop="consumingTime" label="耗时" min-width="160" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 上传产品 -->
      <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadProduct"
        :http-request="UploadProduct" />
      <!-- 上传获取牌价 -->
      <el-upload action="#" v-show="false" accept=".xls, .xlsx" :headers="{ token }" ref="UploadPrice"
        :http-request="UploadPrice" />
      <!-- <errorDialog :visible.sync="tipVisible" :list="tipList" /> -->
    </div>
  </transition>
</template>
<script>
import { addQuotationData, editQuotationMData, getQuotationInfo, denerateQuotationMData, calculatequotationData,calculatequotationSpecData, saleUploadData, saleUploadAmountsCount ,exportNoProduct } from "@/api/salesManagement/index";
import { getCounryData, getPrivateList, deletePrivate, getcategoryTree, privateDetail } from '@/api/basicData/index'
import { getcategoryTrees, getcooperativeProduct } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeInfo, getCooperativeData } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { mapGetters, mapState } from 'vuex'
import workFlow from '@/components/WorkFlow/settingBus.vue'
import { getApprovalTemplate, getApprovalDetailTree, busApprovalFlowTree, getSaleBusDetail, getBusDetail, approvalTransferList } from '@/api/basicData/approvalAdministrator'
// import errorDialog from '@/components/WorkFlow/dialog/errorDialog.vue'
export default {
  components: { workFlow },
  data() {
    return {
      getcategoryTree, // 意向客户分类
      getPrivateList, // 意向客户列表
      yxPartnerRequestObj: {
        code: "",
        name: "",
        taxId: "",
        mobilePhone: '',
        pageNum: 1,
        pageSize: 20,
        partnerCategoryId: "",
        type: "public_private_sea",
      }, // 意向客户列表入参
      yxPartnerSearchList: [
        { prop: 'name', label: '意向客户名称', type: 'input' },
        { prop: 'taxId', label: '税号', type: 'input' },
        { prop: 'mobilePhone', label: '手机号', type: 'input' }
      ], // 意向客户搜索条件
      yxPartnerTableItems: [
        { prop: 'name', label: '意向客户名称' },
        { prop: 'taxId', label: '税号' },
        { prop: 'mobilePhone', label: '手机号' },
        { prop: 'nameEn', label: '英文名称' }
      ], // 意向客户列表字段
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
        remark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 3600 * 24;
        }
      },
      selectRows: [],
      taxRate: '13', // 默认税率
      dataRule: {
        deliver: [{ required: true, message: '致不能为空', trigger: 'blur' }],
        yxCooperativePartnerIdText: [{ required: true, message: '意向客户不能为空', trigger: 'change' }],
        cooperativePartnerIdText: [{ required: true, message: '客户不能为空', trigger: 'change' }],
        validEnd: [{ required: true, message: '有效期止不能为空', trigger: 'blur' }],
        bidder: [{ required: true, message: '报价人不能为空', trigger: 'blur' }],
        quotationTime: [{ required: true, message: '报价时间不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }],
      },
      productRules: {
        // 客户物料号
        customerDrawingNumber: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["客户物料号不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
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
        // 牌价（含税）
        listPrice: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["需要重新生成牌价信息", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：` + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '牌价(含税)等于0，请完善牌价信息', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ],
        // 税率
        taxRate: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["税率不能为空", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '税率必须大于0', (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' },
          { validator: this.formValidate({ type: 'decimal', params: [18, 6, "", (errMsg, index) => { this.$message.error(`产品信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' }
        ],
      },
      // 审批流需要字段
      approvalBusinessId: '',
      workVisible: false,
      busNodeConfig: {
        nodeName: "发起人",
        nodeType: 0,
        type: 'node',
        priorityLevel: "",
        approvalType: "appoint",
        selectMode: "",
        selectRange: "",
        directorLevel: "",
        examineMode: "",
        whenEmpty: "",
        examineEndDirectorLevel: "",
        ccSelfSelectFlag: "",
        conditionList: [],
        nodeUserList: [],
        childNode: null,
        conditionNodes: []
      },
      approvalForm: {},
      firstOneNode: [],
       // 审批 转审记录参数
       transferQuery: {
        approvalFormId: '',
        createByName: "",
        documentId: '',
        endTime: "",
        keyword: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      transferData: [],
      customStyleData: {},
      tableVisible: true,
      loadingText: '',
      fontSizeValue:'',
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
        totalNum = this.jnpf.math('add', [totalNum, this.dataFormTwo.lines[i].num])
      }
      return totalNum
    },
    totalPrice: function () {
      var totalPrice = 0;
      for (var a = 0; a < this.dataFormTwo.lines.length; a++) {
        totalPrice = this.jnpf.math('add', [totalPrice, this.dataFormTwo.lines[a].amounts])
      }
      return this.jnpf.numberFormat(totalPrice, 6)
    },
    ...mapGetters(['userInfo']),
    ...mapState('user', ['token']),
  },
  methods: {
    // 意向客户分类节点点击
    yxPartnerTreeNodeClick(data, node, listQuery) {
      if (listQuery.partnerCategoryId === data.id) return listQuery
      listQuery.partnerCategoryId = data.id
      return listQuery
    },
    // 意向客户选框传值
    yxPartnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('yxCooperativePartnerIdText') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        const partnerInfo = data[0].all
        this.dataForm = {
          ...this.dataForm,
          publicPrivateSeaId: partnerInfo.id,
          yxCooperativePartnerIdText: partnerInfo.name,
          phone: partnerInfo.phone,
          country: partnerInfo.country,
          province: partnerInfo.province,
          city: partnerInfo.city,
          area: partnerInfo.area,
          fax: partnerInfo.fax,
          address: partnerInfo.address
        }
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.publicPrivateSeaId = ""
        this.dataForm.yxCooperativePartnerIdText = ""
      }
    },
    // 客户选框传值
    partnerChange(val, data, paramsObj) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('cooperativePartnerIdText') }) // 校验操作的元素(name是组件绑定的value)
      if (data && data.length) { // 数据有效，进行更新
        const partnerInfo = data[0].all
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
          this.taxRate = partnerInfo.taxRate || 13
          this.dataFormTwo.lines.forEach(row => {
            row.taxRate = this.taxRate
          })
        }
      } else { // 不选择任何内容，置空绑定的值
        this.dataForm.cooperativePartnerId = ""
        this.dataForm.cooperativePartnerIdText = ""
      }
    },
    //客户物料图号
    blurcust(row, index) {
      let a = row.customerDrawingNumber
      if (a) {
        // if (/^[a-zA-Z0-9_]+$/.test(a)) {
        calculatequotationData(this.jnpf.specialCodeUrl(a)).then(res => {
          row.listPrice = res.data.listPrice
          row.unitPrice = res.data.listPrice
          if(res.data.spec) row.spec = res.data.spec
          if(res.data.customerDrawingNumber) row.customerProductDrawingNo = res.data.customerDrawingNumber
          this.watchnums(row, index)
        }).catch((err) => {
          row.listPrice = ''
          row.unitPrice = ''
          row.spec =''
          this.watchnums(row, index)
        })
      }
    },
     //规格型号
     blurSpec(row, index) {
      let a = row.customerDrawingNumber
      let b = row.spec
      if (a) {
        // if (/^[a-zA-Z0-9_]+$/.test(a)) {
          calculatequotationSpecData(this.jnpf.specialCodeUrl(a),this.jnpf.specialCodeUrl(b)).then(res => {
          if(res.data.spec) row.spec = res.data.spec
          if(res.data.customerDrawingNumber) row.customerProductDrawingNo = res.data.customerDrawingNumber
          row.listPrice = res.data.listPrice
          row.unitPrice = res.data.listPrice
          this.watchnums(row, index)
        }).catch((err) => {
          row.listPrice = ''
          row.unitPrice = ''
          row.spec = ''
          this.watchnums(row, index)
        })
      }
    },
    // 批量删除
    batchDelete() {
      if (!this.selectRows.length) return this.$message('请选择要删除的产品')
      if (this.dataFormTwo.lines.length === this.selectRows.length && this.btnType === 'custom') return this.$message.error('至少需要保留一条产品数据')
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.lines.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.lines.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.$nextTick(() => {
        if (!this.dataFormTwo.lines.length) {
          this.busNodeConfig = {
            nodeName: "发起人",
            nodeType: 0,
            type: 'node',
            priorityLevel: "",
            approvalType: "appoint",
            selectMode: "",
            selectRange: "",
            directorLevel: "",
            examineMode: "",
            whenEmpty: "",
            examineEndDirectorLevel: "",
            ccSelfSelectFlag: "",
            conditionList: [],
            nodeUserList: [],
            childNode: null,
            conditionNodes: []
          }
          this.workVisible = false
        } else {
          this.getApproverData()
        }
      })
      this.selectRows = []; // 清空选中的行的数据
    },
    // 联系人信息新增行
    addtable(type, data) {
      if (!type) {
        this.dataFormTwo.lines.push({
          salesQuotationId: '',
          customerProductDrawingNo: '',
          customerDrawingNumber: '',
          materialDescription: "",
          spec: "",
          num: "",
          listPrice: "",
          unitPrice: "",
          excludingTaxUnitPrice: "",
          discount: "",
          amounts: "",
          excludingTaxAmounts: "",
          totalTaxAmount: "",
          mainUnit: "",
          taxRate: this.taxRate,
          remark: "",
          remark2: ""
        })
      } else if (type === 'product') {
        // 导入产品，获取数据渲染
        if (this.dataFormTwo.lines.length) {
          this.$confirm(`确定导入新的产品数据吗？这会覆盖已有的数据`, `提示`, { type: 'warning' }).then(() => {
            this.$refs.UploadProduct.$el.querySelector('input').click()
              // 审批
          this.$nextTick(() => { this.getApproverData() })
          }).catch(() => { })
        } else {
          this.$refs.UploadProduct.$el.querySelector('input').click()
          // 审批
          this.$nextTick(() => { this.getApproverData() })
        }
      } else if (type === 'price') {
        // 导入获取牌价 传excel 后端获取牌价，放到excel返回下载，用户填单价，然后导入产品
        this.$refs.UploadPrice.$el.querySelector('input').click()
      }
    },
    // 上传产品
    UploadProduct(data) {
      this.loadingText = '正在导入数据'
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      //调用上传文件接口
      saleUploadData(formData).then(res => {
        this.$message.success(`数据更新成功`)
        this.dataFormTwo.lines = res.data
        this.formLoading = false
        this.loadingText = ''
      }).catch(err => {
        this.$message.error(`导入数据超过最大限制：500`)
        this.formLoading = false
        this.loadingText = ''
      })
    },
    // 上传获取牌价
    UploadPrice(data) {
      this.formLoading = true
      var formData = new FormData()
      formData.append("file", data.file)
      //调用上传文件接口
      saleUploadAmountsCount(formData).then(res => {
        this.$message.success(`文件上传成功`)
        this.jnpf.downloadFile(res.data.url, res.data.name)
        this.formLoading = false
      }).catch(err => {
        this.$message.error(`文件上传失败`)
        this.formLoading = false
      })
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
      if (this.dataFormTwo.lines.length === 1 && this.btnType === 'custom') return this.$message.error('至少需要保留一条产品数据')
      this.dataFormTwo.lines.splice(row.$index, 1)
      this.$nextTick(() => {
        if (!this.dataFormTwo.lines.length) {
          this.busNodeConfig = {
            nodeName: "发起人",
            nodeType: 0,
            type: 'node',
            priorityLevel: "",
            approvalType: "appoint",
            selectMode: "",
            selectRange: "",
            directorLevel: "",
            examineMode: "",
            whenEmpty: "",
            examineEndDirectorLevel: "",
            ccSelfSelectFlag: "",
            conditionList: [],
            nodeUserList: [],
            childNode: null,
            conditionNodes: []
          }
          this.workVisible = false
        } else {
          this.getApproverData()
        }
      })
    },
    // 监听主数量输入
    watchnums(row, index) {
      // 数量处理
      row.num = row.num.replace(/[^\d.]/g, '');
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
      if (row.num.length) {
        console.log(2222222222222);
        // 数量变化 更新审批流程
        this.$nextTick(() => { this.getApproverData() })
      }
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
      // 折扣率处理
      if (row.unitPrice && row.listPrice && row.unitPrice != '0' && row.listPrice != '0') {
        let a = this.jnpf.math('multiply',[this.jnpf.numberFormat(row.unitPrice / row.listPrice),100])
        row.discount = a ? a : 0
      } else {
        row.discount = ''
      }
      // 税率
      if (row.unitPrice && row.unitPrice != '0') {
        let b = this.jnpf.numberFormat((row.unitPrice / (1 + row.taxRate / 100)), 4)
        row.excludingTaxUnitPrice = b ? b : 0
      } else {
        row.excludingTaxUnitPrice = ''
      }
      if (!row.num || !row.unitPrice) {
        row.amounts = ''
        row.totalTaxAmount = ''
        this.dataForm.totalAmount = 0
      } else {
        let a = this.jnpf.numberFormat((row.unitPrice * row.num), 6)
        row.amounts = a ? a : '' // 含税金额
      }
      if (row.excludingTaxUnitPrice && row.num) {
        let c = this.jnpf.numberFormat((row.excludingTaxUnitPrice * row.num), 6)
        row.excludingTaxAmounts = c ? c : ''
      } else {
        row.excludingTaxAmounts = ''
      }
      if (row.excludingTaxAmounts && row.amounts) { // 税额计算
        let d = this.jnpf.numberFormat((row.amounts * 1 - row.excludingTaxAmounts * 1), 6)
        row.totalTaxAmount = d ? d : 0
      }
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      this.selectRows = val
    },
    init(id, btnType) {
      // 表格表单适配模式
      this.$nextTick(() => { this.switchStyle('onresize') });
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (btnType == 'look' || btnType == 'custom' || btnType == 'bjkh') {
        this.iszt = false
        this.status = true
      } else {
        this.iszt = true
        this.status = false
      }
      if (this.btnType == 'add' && !this.dataForm.id) {
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
        // 审批
        // this.getApproverData()
      }
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
          this.dataForm.yxCooperativePartnerIdText = this.dataForm.cooperativePartnerIdText
          this.dataFormTwo.lines = res.data.lines
          this.dataForm.totalAmount = 0
          this.dataForm.approvalStatus = ''
          this.dataForm.submitDate = ''
          this.dataForm.approvalCompletionDate = ''
          this.dataForm.id = ''
          this.dataForm.reasonRejection = ''
          if (this.btnType === 'custom') {
            this.dataForm.cooperativePartnerIdText = ''
          }
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
          // 审批
          this.$nextTick(() => {
            this.getApproverData()
          })
          this.formLoading = false
          // })
        }).catch(err => {
          this.formLoading = false
        })
      }
      if (this.dataForm.id && this.btnType !== 'add') {
        this.formLoading = true
        getQuotationInfo(this.dataForm.id).then(res => {
          this.$nextTick(() => {
            this.dataForm = res.data.sale
            this.dataForm.yxCooperativePartnerIdText = this.dataForm.cooperativePartnerIdText
            this.dataFormTwo.lines = res.data.lines
            this.dataForm.totalAmount = 0
            if (this.btnType === 'custom') {
              this.dataForm.cooperativePartnerIdText = ''
            }
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
          })
        }).catch(err => {
          this.formLoading = false
        })
        getSaleBusDetail(this.dataForm.id).then(res => {
          console.log(res, '业务详情');
          if (res.data) {
            this.firstOneNode = []
            this.approvalForm = res.data.form
            this.transferQuery.approvalFormId = this.approvalForm.id
            this.firstOneNode.push({
              name: res.data.form.createByName
            })
            let data = res.data.formNodeTree.childNode
            if (data) {
              this.addNodeTypeAndNodeName(data)
              this.busNodeConfig.childNode = data
              this.workVisible = true
              // this.$nextTick(() => {
              //   this.$refs.workflowRef.initData('busing', this.btnType)
              // })
            }
            if (this.btnType == 'look') {
              console.log(this.approvalForm, '++++++++++');
              this.transferQuery.documentId = this.dataForm.id
              approvalTransferList(this.transferQuery).then(res => {
                console.log(res, '流转记录');
                this.transferData = res.data.records
              })
            }
          } else {
            this.busNodeConfig.childNode = null
          }
        })
      }
    },
    async handleConfirm(value) {
      this.dataForm.documentStatus = value
      this.btnLoading = true
      let submitFlag = true
      // 审批条件参数列表
      let nodeCondList = []
      // 审批抄送人列表
      let ccList = []
      let ccLists = []
      let nodeJudg = []
      // 业务审批单流程节点列表
      let formNodeList = []
      // 业务审批单
      let form = {}
      // 增加审批限制  yc 1.30
      let templateLineList = []
      if (this.btnType === 'add') {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && value === 'submit') {
            submitFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!submitFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && value === 'submit') {
            submitFlag = ccList.every(item=>item.nodeUserList.length)
            if (!submitFlag) { 
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          } 
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              approvalStatus: item.name == '审核人' ? 'no' : '',
              adminId: '',
              id: '',
              previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              name: item.nodeName,
              designatedMembersId:  item.designatedMembersId ? item.designatedMembersId :  item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalTemplateId: item.approvalTemplateId ? item.approvalTemplateId : this.approvalForm.id,
              ccToId: item.targetId,
              approvalFormNodeCode: item.approvalTemplateLineCode ? item.approvalTemplateLineCode : item.code,
              id: '',
              defaultFlag: item.defaultFlag == 0 ? item.defaultFlag : 1,
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
            documentId: '',
            id: ''
          }
        }
      } else {
        if (this.busNodeConfig.childNode) {
          let data = JSON.parse(JSON.stringify(this.busNodeConfig))
          let flattenedNodes = this.flattenNodes(data);
          flattenedNodes.splice(0, 1)
          flattenedNodes = flattenedNodes.map(item=>{
            return {
              ...item,
              nodeUserList:item.nodeUserList ? item.nodeUserList : []
            }
          })
          templateLineList = flattenedNodes.filter(item => item.nodeName === '审核人')
          // 抄送人节点数组 ccList
          ccList = flattenedNodes.filter(item => item.nodeName === '抄送人')
          for (var i = 0; i < ccList.length; i++) {
            var nodeUserList = ccList[i].nodeUserList;
            ccLists = ccLists.concat(nodeUserList);
          }
          if (templateLineList.length && value === 'submit') {
            submitFlag = templateLineList.every(item=>item.nodeUserList.length)
            if (!submitFlag) { 
              this.$message.error('审核人不能为空！')
              this.btnLoading = false
              return
            }
          }
          if (ccList.length && value === 'submit') {
            submitFlag = ccList.every(item=>item.nodeUserList.length)
            if (!submitFlag) { 
              this.$message.error('抄送人不能为空！')
              this.btnLoading = false
              return
            }
          } 
          // return
          // 条件节点数组 nodeJudgmentList
          nodeCondList = flattenedNodes.filter(item => item.type === 'condition')
          // 业务审批单流程节点参数
          formNodeList = flattenedNodes.map((item, index) => {
            return {
              ...item,
              // previousCode: item.type === 'condition' ? item.previousCode : (index === 0 ? '' : flattenedNodes[index - 1].code),
              // name: item.nodeName,
              designatedMembersId: item.designatedMembersId ? item.designatedMembersId : item.nodeUserList.length ? item.nodeUserList[0].targetId : '',
            }
          })
          // 抄送人
          ccLists = ccLists.map(item => {
            return {
              ...item,
              approvalFormId: item.approvalFormId ? item.approvalFormId : this.approvalForm.id,
              approvalFormNodeCode: item.approvalFormNodeCode ? item.approvalFormNodeCode : item.code,
              ccToId: item.targetId,
              id: item.id ? item.id : ''
            }
          })
          // 条件列表
          if (nodeCondList.length) {
            nodeJudg = nodeCondList.map(item => {
              return {
                ...item,
                approvalFormNodeCode: item.code,
                businessValue: item.conditionList[0].tjCode == 'numCode' ? this.totalNum : this.totalPrice,
                code: item.conditionList[0].tjCode,
                dataType: item.conditionList[0].dataType,
                id: item.conditionList[0].id ? item.conditionList[0].id : ''
              }
            })
          }
          // 业务审批单
          form = {
            ...this.approvalForm,
            approvalTemplateId: this.approvalForm.id,
            documentStatus: value,
          }
        }
      }
      if (value === 'submit' && this.dataForm.approvalFlag) {
        if (!this.busNodeConfig.childNode) {
          submitFlag = false
          this.btnLoading = false
          this.$message.error('未找到匹配的审批流程，请联系管理员！')
        }
        if (formNodeList.length) {
          formNodeList.forEach(item => {
            if (item.approvalType === 'option') {
              if (!item.designatedMembersId) {
                submitFlag = false
                this.btnLoading = false
                this.$message.error('未配置发起人自选！')
              }
            }
          })
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
      if (submitFlag) {
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
        let obj = {
          attachmentList: this.datafilelist,
          sale: this.dataForm,
          lines: this.dataFormTwo.lines,
          form: form,
          formNodeList,
          nodeCondList: nodeJudg,
          ccList: ccLists,
        }
        console.log(obj, '参数');
        // return
        let formMethod = null;
        if (this.btnType == 'edit' || this.btnType == 'bjkh') {
          formMethod = editQuotationMData
        } else if (this.btnType == 'add') {
          formMethod = addQuotationData
        } else if (this.btnType == 'custom') {
          formMethod = denerateQuotationMData
        }
        formMethod(obj).then(res => {
          let msg = "";
          if (this.btnType == 'edit') {
            msg = "提交成功"
          } else if (this.btnType == 'add') {
            msg = "新建成功"
          } else {
            if (res.data){
              this.btnLoading = false
              this.handleMessage(res.data)
              return
            }else{
              msg = '生成客户产品成功'
            }
          }
          this.$message({
            message: msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.$emit('close', true)
            }
          })
        }).catch(() => {
          this.btnLoading = false
        })
      } else {
        this.btnLoading = false
      }
    },
    // 获取审批流参数递归处理
    addNodeTypeAndNodeName(obj) {
      console.log(obj);
      if (obj) {
        if (obj.name === "审核人") {
          obj.nodeType = 1;
          obj.nodeName = obj.name;
          obj.directorLevel = obj.approvalType == "manager" ? obj.levelSupervisor : ''
          obj.examineEndDirectorLevel = obj.approvalType == "multilevel" ? obj.levelSupervisor : ''
        }
        if (obj.name === "路由") {
          obj.nodeType = 4;
        }
        if (obj.name === "抄送人") {
          obj.nodeType = 2;
          obj.nodeName = obj.name;
        }
        if (obj.childNode) {
          this.addNodeTypeAndNodeName(obj.childNode);
        } else {
          if (obj.conditionNodes) {
            for (let i = 0; i < obj.conditionNodes.length; i++) {
              obj.conditionNodes[i].priorityLevel = obj.conditionNodes[i].priority
              obj.conditionNodes[i].showName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeName = obj.conditionNodes[i].name
              obj.conditionNodes[i].nodeType = 3
              obj.conditionNodes[i].conditionList = obj.conditionNodes[i].conditionList.map(item => {
                // this.approvalBusinessId = item.approvalBusinessId
                if (item.optionNames && item.optionValues) {
                  var optionNames = item.optionNames.split(','); // 如果习惯使用英文逗号，这里可以用 ','
                  var optionValues = item.optionValues.split(',');
                  var resultArr = [];
                  if (optionNames.length === optionValues.length) {
                    for (var i = 0; i < optionNames.length; i++) {
                      var option = {
                        label: optionNames[i],
                        value: optionValues[i]
                      };
                      resultArr.push(option);
                    }
                  }
                }
                return {
                  ...item,
                  columnDbname: item.name,
                  columnType: item.dataType,
                  showName: item.name,
                  tjCode: item.code,
                  zdy1: item.comparisonValue,
                  columnId: item.approvalBusinessId,
                  options: resultArr,
                  optType: item.dataType == 'number' ? (item.operationalFormula == 'lt' ? '1' : item.operationalFormula == 'gt' ? '2' : item.operationalFormula == 'eq' ? '4' : item.operationalFormula == 'ge' ? '5' : item.operationalFormula == 'le' ? '3' : '') : ''
                }
              })
              this.addNodeTypeAndNodeName(obj.conditionNodes[i].childNode);
            }
          }
        }
      }
    },
    // // 审批 提交参数递归处理
    flattenNodes(node, flattenedNodes = [], previousCode = '') {
      if (node) {
        console.log(node, '提交数1');
        if (node.name !== '路由') flattenedNodes.push({ ...node, childNode: null, conditionNodes: null });
        if (node.type === 'node') {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
          // delete node.childNode;
        } else if (node.type === 'condition' && node.name === '路由') {
          if (node.conditionNodes) {
            for (let i = 0; i < node.conditionNodes.length; i++) {
              // let previousCode = node.conditionNodes[i].code
              node.conditionNodes[i].previousCode = previousCode
              this.flattenNodes(node.conditionNodes[i], flattenedNodes, node.conditionNodes[i].code);
            }
          }
          // if (node.childNode) {
          //   this.flattenNodes(node.childNode, flattenedNodes,node.code);
          // }
        } else if (node.nodeType == 3) {
          if (node.childNode) {
            node.previousCode = previousCode
            this.flattenNodes(node.childNode, flattenedNodes, node.code);
          }
        }
      }
      return flattenedNodes;
    },
    // // 获取审批模版
    getApproverData() {
      this.firstOneNode = []
      let condArr = ['>', '<', '>=', '<=', '=']
      let state = ''
      let condExpress = ''
      let foundSymbol = ''  // 条件符号
      let result = null     // 判断条件是否成立
      let condList = []
        getBusDetail('b001').then(res => {
          console.log(res);
          state = res.data.business.state
          condExpress = res.data.business.condExpress
          if (res.data.businessConditionList.length) {
            res.data.businessConditionList.forEach(item => {
              condList.push({
                code: item.code,
                val: item.code === 'numCode' ? this.totalNum : this.totalPrice
              })
            })
          }
          if (state === 'condition') {
            this.dataForm.approvalFlag = 1
            for (var i = 0; i < condArr.length; i++) {
              if (condExpress.includes(condArr[i])) {
                foundSymbol = condArr[i];
                break;
              }
            }
            // 找到符号并进行销售报价业务判断
            if (foundSymbol) {
              const parts = condExpress.split(foundSymbol); // 使用 ">" 符号拆分字符串
              const leftValue = parts[0]; // 提取 ">" 符号左边的值
              const rightValue = parts[1]; // 提取 ">" 符号右边的值
              console.log(leftValue);
              console.log(rightValue);
              if (leftValue == 'numCode') {
                const condition = `${this.totalNum} ${foundSymbol} ${this.totalPrice}`; // 构建条件表达式
                result = eval(condition); // 执行条件判断
              } else {
                const condition = `${this.totalPrice} ${foundSymbol} ${this.totalNum}`; // 构建条件表达式
                result = eval(condition); // 执行条件判断
              }
              if (result) {
                let query = {
                  businessCode: "b001",
                  condList,
                }
                busApprovalFlowTree(query).then(res => {
                  console.log(res, '树详情');
                  if (res.data) {
                    this.firstOneNode = []
                    this.approvalForm = res.data.template
                    this.firstOneNode.push({
                      name: this.userInfo.userName
                    })
                    let data = res.data.tempLineTree.childNode
                    if (data) {
                      this.addNodeTypeAndNodeName(data)
                      this.busNodeConfig.childNode = data
                      this.workVisible = true
                      this.$nextTick(() => {
                        this.$refs.workflowRef.initData('busing', this.btnType)
                      })
                    }
                  } else {
                    this.busNodeConfig.childNode = null
                  }
                })
              } else {
                this.busNodeConfig.childNode = null
              }
            }
          }
          if (state === 'enable') {
            this.dataForm.approvalFlag = 1
            let query = {
              businessCode: "b001",
              condList,
            }
            busApprovalFlowTree(query).then(res => {
              console.log(res, '树详情');
              if (res.data) {
                this.firstOneNode = []
                this.approvalForm = res.data.template
                this.firstOneNode.push({
                  name: this.userInfo.userName
                })
                let data = res.data.tempLineTree.childNode
                if (data) {
                  this.addNodeTypeAndNodeName(data)
                  this.busNodeConfig.childNode = data
                  this.workVisible = true
                  this.$nextTick(() => {
                    this.$refs.workflowRef.initData('busing', this.btnType)
                  })
                }
              } else {
                this.busNodeConfig.childNode = null
              }
            })
          }
          if (state === 'disabled') {
            this.dataForm.approvalFlag = 0
            this.busNodeConfig.childNode = null
          }
        })
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
    downNoProduct(res){
      this.jnpf.downloadFile(res.url, res.name)
    },
    // 提示
    handleMessage(data){
      const h = this.$createElement
          this.$message({
            type:"error",
            duration:0,
            showClose: true,
            customClass: 'my-message', // 自定义类名，用于设置样式
            message: h('div',
              {
                style: "padding-right:20px;display:flex;align-items:center;color:#f56c6c;"
              },
            [
                h('p',{style:'font-size:14px;'},'生成失败，存在客户产品找不到产品档案！'),
                h('el-button',{
                  props:{
                    type:'text',
                    size:"mini",
                    icon:'el-icon-download'
                  },
                  on:{
                    click:()=>{
                      this.downNoProduct(data)
                    }
                  },
                style :{
                  border:"none",
                  textAlign:"center",
                  // width:"20%",
                  margin:"0 5px 0 5px ",
                },
                },'下载无档案列表')
              ]
            ),
          })
      return
    },
    // 导出无价格
    async exportPrice(){
      if (this.dataFormTwo.lines.length){
        // 进行导出 且必须得是无牌价的产品
        let priceProductList = this.dataFormTwo.lines.filter(item=>!Number(item.listPrice)).map((item,index)=>{
          return {
            ...item,
            no:index + 1,
          }
        })
        if (priceProductList.length) {
            let query = {
              businessCode:'other',
              dataList:priceProductList
            }
            const res = await exportNoProduct(query)
            if (res.data){
              this.jnpf.downloadFile(res.data.url, res.data.name)
            }
        } else{
          this.$message.warning('暂无产品导出!')
        } 
      }else{
        this.$message.warning('请先添加产品!')
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
}
::v-deep .el-tabs__header {
  padding-left: 0 !important;
}
::v-deep .workNode {
  background-color: #f5f5f7 !important;
}
//.el-button--small {
// padding: 1;
//}
</style>
<style scoped>
::v-deep .el-tabs {
  height: 100%!important;
}
::v-deep .el-tabs__content {
  /* height: auto !important; */
  height: calc(100% - 47px) !important;
  overflow:auto!important;
  padding: 0 20px;
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
.noDataTip {
  text-align: center;
  padding: 20%;
  font-size: 16px;
  min-height: 1045px !important;
  background-color: #f5f5f7 !important;
  color: #576a95;
}
</style>
<style>
  .my-message{
    font-size: 16px !important;
  }
</style>