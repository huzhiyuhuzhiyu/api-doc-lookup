<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', type === 'look' ? 'noButtons' : '']">
          <el-page-header @back="goBack" :content="dialogTitle + `生产资源`" />
          <div class="options" v-if="type != 'look'">
            <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
              提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main">
          <el-tabs v-model="activeName">
            <el-tab-pane label="基础信息" name="jcInfo">
              <div
                style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                <h5>基础信息</h5>
              </div>
              <el-row :gutter="15" class="">
                <el-form ref="elForm" :model="dataForm" :rules="rules" size="small" label-width="100px"
                  label-position="top">
                  <template v-if="!loading">
                    <el-col :span="12">
                      <el-form-item label="产品名称" prop="productName" ref="productName">

                        <ComSelect-page :value="dataForm.productName" :isdisabled="type == 'look'" placeholder="请选择产品名称"
                          ref="ComSelect-page" @change="addth" :tableItems="ProductTableItems" title="选择产品"
                          treeTitle="产品分类" :methodArr="ProductMethodArr" :listMethod="getProductList"
                          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="true"
                          :paramsObj="{ type: 'dataFormProduct' }" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="12">
                      <el-form-item label="产品编码" prop="productCode" ref="productCode">
                        <el-input v-model="dataForm.productCode" clearable :style='{ "width": "100%" }' maxlength="20"
                          disabled></el-input>
                      </el-form-item>
                    </el-col>


                    <el-col :span="12">
                      <el-form-item label="工艺路线名称" prop="routingName" ref="routingName">
                        <!-- <el-input v-model="dataForm.name" placeholder="请选择工艺路线" clearable :style='{ "width": "100%" }'
                          maxlength="20" :disabled="type == 'look'"></el-input> -->

                        <ComSelect-list :dataFormatting="dataFormatting" :isdisabled="type === 'look'"
                          v-model="dataForm.routingName" placeholder="请选择工艺路线" auth @change="onOrganizeChangeTwo"
                          :title="'选择工艺路线'" :method="getProcessList" :requestObj="routingParams" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="工艺路线编码" prop="routingCode" ref="routingCode">
                        <el-input v-model="dataForm.routingCode" clearable :style='{ "width": "100%" }' maxlength="20"
                          disabled></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="备注" prop="routingCode" ref="routingCode">
                        <el-input :row="3" type="textarea" v-model="dataForm.remark" placeholder="请输入备注" clearable
                          :style='{ "width": "100%" }' maxlength="200" :disabled="type == 'look'"></el-input>
                      </el-form-item>
                    </el-col>



                    <el-col :span="24">
                      <div
                        style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
                        <h5>工序信息</h5>
                      </div>
                      <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm">

                        <el-table hasC hasNO fixedNO style="border: 1px solid #e3e7ee;" v-bind="dataFormTwo.data"
                          :data="dataFormTwo.data" size='mini' id="table" >
                          <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                          <el-table-column prop="processCode" label="工序编码" width="180" show-overflow-tooltip>
                            <template slot-scope="scope">
                              <!-- <el-input v-model="scope.row.processVO.name" readonly maxlength="20" placeholder="请输入"
                                :disabled="true">{{
                                  scope.row.processVO.name }}
                              </el-input> -->
                              <div class="viewData">
                                <span>{{ scope.row.processCode }}</span>
                              </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="name" label="工序名称" width="180" show-overflow-tooltip>
                            <template slot-scope="scope">
                              <!-- <el-input v-model="scope.row.processVO.name" readonly maxlength="20" placeholder="请输入"
                                :disabled="true">{{
                                  scope.row.processVO.name }}
                              </el-input> -->
                              <div class="viewData">
                                <span>{{ scope.row.processName }}</span>
                              </div>
                            </template>
                          </el-table-column>

                          <el-table-column prop="productName" label="产品名称" width="220">

                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.productName'" ref="productName"
                                :rules="rulesTwo.productName">
                                <ComSelect-page clearable :value="scope.row.productName" :isdisabled="type == 'look'"
                                  placeholder="请选择产品名称" ref="ComSelect-page" @change="addth"
                                  :tableItems="ProductTableItems" title="选择产品" treeTitle="产品分类"
                                  :methodArr="ProductMethodArr" :listMethod="getProductList"
                                  :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList"
                                  :elementShow="true" :paramsObj="{ type: 'dataFormTwoProduct', index: scope.$index }" />
                              </el-form-item>
                            </template>
                          </el-table-column>


                          <el-table-column prop="standardHour" label="标准工时" min-width="180" v-if="standardHourFlag === 2" >
                            <template slot="header">
                              <span class="required">*</span>标准工时(秒/件)
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.standardHour'" ref="standardHour"
                                :rules="standardHourFlag == 2&&scope.row.processingType=='self_produced' ? rulesTwo.standardHour : []" :key="'data.' + scope.$index + '.standardHour'">
                                <!-- <el-form-item :prop="'data.' + scope.$index + '.standardHour'" ref="standardHour"
                                :rules="rulesTwo.standardHour"> -->
                                <el-input v-model.number="scope.row.standardHour" placeholder="请输入标准工时" clearable
                                  maxlength="9" :disabled="type === 'look'||scope.row.processingType=='external_production'"> 
                                </el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="actualHour" label="实际工时(秒/件)" min-width="160"
                            v-if="(type === 'edit' || type === 'look') && standardHourFlag === 2">
                            <template slot-scope="{row}">

                              <el-form-item prop="actualHour" ref="actualHour">
                                <el-input v-model.number="row.actualHour" readonly placeholder="请输入实际工时" clearable
                                  maxlength="9" :disabled="type != 'add'">
                                </el-input>
                              </el-form-item>

                            </template>
                          </el-table-column>

                          <el-table-column prop="pricingType" label="计价类型" min-width="180" v-if="type == 'look'">
                            <template slot="header">
                              <span class="required">*</span>计价类型
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.pricingType'" ref="pricingType"
                                :rules="rulesTwo.pricingType">
                                <!-- <el-input v-model.number="scope.row.pricingType" placeholder="请输入标准工时" clearable
                                  maxlength="9" :disabled="type === 'look'"></el-input> -->
                                <el-select :disabled="type === 'look'" v-model="scope.row.pricingType"
                                  placeholder="请选择计价类型" filterable clearable
                                  @change="changePricingType(scope.$index, scope.row.pricingType)">
                                  <el-option v-for="(item, index) in pricingTypeList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                                </el-select>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="unitPrice" label="正品单价" min-width="180" v-if="type == 'look'">
                            <template slot="header">
                              <span class="required">*</span>正品单价(计件)
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.unitPrice'" ref="unitPrice"
                                :rules="scope.row.pricingType === 'by_piece' ? rulesTwo.unitPrice : []">
                                <el-input v-if="scope.row.pricingType === 'by_piece'" v-model="scope.row.unitPrice"
                                  placeholder="请输入正品单价" clearable maxlength="9" :disabled="type === 'look'">
                                </el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="rejectUnitPrice" label="次品单价" min-width="180" v-if="type == 'look'">
                            <template slot="header">
                              <span class="required">*</span>次品单价(计件)
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.rejectUnitPrice'" ref="rejectUnitPrice"
                                :rules="scope.row.pricingType === 'by_piece' ? rulesTwo.rejectUnitPrice : []">
                                <el-input v-if="scope.row.pricingType === 'by_piece'" v-model="scope.row.rejectUnitPrice"
                                  placeholder="请输入次品单价" clearable maxlength="9" :disabled="type === 'look'">
                                </el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="scrapUnitPrice" label="废品单价" min-width="180" v-if="type == 'look'">
                            <template slot="header">
                              <span class="required">*</span>废品单价(计件)
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.scrapUnitPrice'" ref="scrapUnitPrice"
                                :rules="scope.row.pricingType === 'by_piece' ? rulesTwo.scrapUnitPrice : []">
                                <el-input v-if="scope.row.pricingType === 'by_piece'" v-model="scope.row.scrapUnitPrice"
                                  placeholder="请输入废品单价" clearable maxlength="9" :disabled="type === 'look'">
                                </el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>

                          <el-table-column prop="timePrice" label="计时单价" min-width="180"
                            v-if="businessType !== 'STANDARD' && type == 'look'">
                            <template slot="header">
                              <span class="required">*</span>计时单价
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.timePrice'" ref="timePrice"
                                :rules="scope.row.pricingType != 'by_time' ? [] : rulesTwo.timePrice">
                                <el-input v-if="scope.row.pricingType === 'by_time'" v-model="scope.row.timePrice"
                                  placeholder="请输入计时单价" clearable maxlength="9" :disabled="type === 'look'">

                                </el-input>
                              </el-form-item>
                            </template>
                          </el-table-column>
                          <el-table-column prop="processType" label="工序类型" width="130" v-if="standardHourFlag === 2">
                            <template slot-scope="scope">

                              <div class="viewData" v-if="scope.row.processType == 'normal'">正常工序 </div>
                              <div class="viewData" v-if="scope.row.processType == 'forge'">锻打工序 </div>
                              <div class="viewData" v-if="scope.row.processType == 'plating'">电镀工序 </div>
                              <div class="viewData" v-if="scope.row.processType == 'drill'">钻孔工序 </div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="platingCode" label="电镀" min-width="180" v-if="standardHourFlag === 2">
                            <template slot="header">
                              <span class="required">*</span>电镀
                            </template>
                            <template slot-scope="scope">
                              <el-form-item :prop="'data.' + scope.$index + '.platingCode'" ref="platingCode"
                                :rules="scope.row.processType === 'plating' ? rulesTwo.platingCode : []">
                                <el-select v-if="scope.row.processType === 'plating'" placeholder="请选择电镀"
                                  v-model="scope.row.platingCode" :disabled="type === 'look'">
                                  <el-option v-for="(item, index) in platingList" :key="index" :label="item.label"
                                    :value="item.value"></el-option>
                                </el-select>
                                <div v-else></div>
                              </el-form-item>
                            </template>
                          </el-table-column>



                          <!-- { label: "正常工序", value: "normal" },
        { label: "锻打工序", value: "forge" },
        { label: "电镀工序", value: "plating" },
        {label:"钻孔工序",value:"drill"} -->

                          <!-- <el-table-column prop="processingTypeName" label="加工类型" width="130">
                            <template slot-scope="scope">
                           
                              <div class="viewData">
                                <span>{{ scope.row.processVO.processingTypeName }}</span>
                              </div>
                            </template>
                          </el-table-column> -->
                          <el-table-column prop="firstFlag" label="是否首道工序" width="130">
                            <template slot-scope="scope">
                              <el-form :ref="`tableForm_1_${scope.$index}`" :model="scope.row">
                                <el-form-item prop="firstFlag" ref="firstFlag">
                                  <el-checkbox :label="true" v-model="scope.row.firstFlag" :true-label="1"
                                    :disabled="true">
                                    {{ scope.row.firstFlag ? '是' : '否' }}
                                  </el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column prop="pickingFlag" label="是否领料" min-width="130">
                            <template slot-scope="{row}">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row">
                                <el-form-item prop="pickingFlag" ref="pickingFlag">
                                  <el-checkbox v-model="row.pickingFlag" :true-label="1" :disabled="true"
                                    :false-label="0"></el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column prop="firstInspection" label="是否首检" min-width="130">
                            <template slot-scope="{row}">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row">
                                <el-form-item prop="firstInspection" ref="firstInspection">
                                  <el-checkbox v-model="row.firstInspection" :true-label="1" :disabled="true"
                                    :false-label="0"></el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column prop="reportFlag" label="是否报工" min-width="130">
                            <template slot-scope="{row}">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row">
                                <el-form-item prop="reportFlag" ref="reportFlag">
                                  <el-checkbox v-model="row.reportFlag" :true-label="1" :disabled="true"
                                    :false-label="0"></el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>



                          <!-- <el-table-column prop="checkFlag" label="是否检验工序" min-width="130">
                            <template slot-scope="{row}">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row">
                                <el-form-item prop="checkFlag" ref="checkFlag">
                                  <el-checkbox v-model="row.checkFlag" :true-label="1" :disabled="true"
                                    :false-label="0"></el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column> -->


                          <el-table-column prop="stockFlag" label="是否入库" min-width="130">
                            <template slot-scope="{row}">
                              <el-form :ref="`tableForm_1_${row.index}`" :model="row">
                                <el-form-item prop="stockFlag" ref="stockFlag">
                                  <el-checkbox v-model="row.stockFlag" :true-label="1" :disabled="true"
                                    :false-label="0"></el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>

                          <el-table-column prop="lastFlag" label="是否末道工序" min-width="130">
                            <template slot-scope="scope">
                              <el-form :ref="`tableForm_1_${scope.row.index}`" :model="scope.row">
                                <el-form-item prop="lastFlag" ref="lastFlag">
                                  <!-- <el-radio-group v-model="scope.row.lastFlag">
                                    <el-radio :label="true" :disabled="true">{{
                                      scope.row.lastFlag ? '是' : "否"
                                    }}</el-radio>
                                  </el-radio-group> -->
                                  <el-checkbox :label="true" v-model="scope.row.lastFlag" :disabled="true">{{
                                    scope.row.lastFlag ? '是' : '否' }}</el-checkbox>
                                </el-form-item>
                              </el-form>
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="160" fixed="right">
                            <template slot-scope="scope">
                              <!-- <el-button type="text" class="JNPF-table-delBtn" :disabled="true"
                                @click="delequipment_process_relList(scope.$index)">删除</el-button> -->
                              <el-button type="text" @click="handlerOpenSource(scope.$index, type)">资源配置</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                        <!-- <div class="table-actions" @click="handlerOpenDialog(dataFormTwo.length, 'add')"
                          v-if="type != 'look'">
                          <el-button type="text" icon="el-icon-plus">添加</el-button>
                        </div> -->

                      </el-form>
                    </el-col>
                  </template>
                </el-form>
                <!-- <SelectDialog v-if="selectDialogVisible" :config="currTableConf" :formData="dataForm" ref="selectDialog"
              @select="addForSelect" @close="selectDialogVisible=false" /> -->
              </el-row>

            </el-tab-pane>
            <!-- <el-tab-pane label="审批流程" name="approvalProcess">
          </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </transition>
    <!-- <process-dialog v-if="processVisibled" ref="processRef" @dataFormSubmit="submit"></process-dialog> -->
    <source-area v-if="sourceVisibled" ref="sourceRef" @confirm="handlerConfirm"></source-area>
    <el-dialog :close-on-click-modal="false" append-to-body :visible.sync="depFormVisible" title="电镀"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll width="60%">
      <el-row class="JNPF-common-search-box" :gutter="16" style="margin-top:10px">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="tableQuery.code" placeholder="请输入编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-input v-model.trim="tableQuery.name" placeholder="请输入名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker v-model="createTimeArr" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']" style="width: 100%;" start-placeholder="请选择创建开始时间"
                end-placeholder="请选择创建结束时间" :picker-options="global.timePickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="search()">
                {{ $t('common.search') }}</el-button>
              <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                $t('common.reset') }}
              </el-button>

            </el-form-item>
          </el-col>
        </el-form>
      </el-row>


      <JNPF-table v-loading="listLoading" :data="tableDataList" ref="dataTable" height="600px">
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="单价" />
        <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
        <el-table-column prop="createByName" label="创建人"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="180" sortable="custom" />
        <el-table-column prop="updateByName" label="修改人"></el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button @click="selectProclie(scope)" type="text">选择</el-button>
          </template>
        </el-table-column>
      </JNPF-table>
      <pagination :total="total" :page.sync="tableQuery.pageNum" :background="background"
        :limit.sync="tableQuery.pageSize" @pagination="initData" />
    </el-dialog>
  </div>
</template>
<script>
import { updateApproval } from '@/api/basicData/approvalBusinessConditions'
// import { addProcess, detailProcess, checkBimRoutingCode } from '@/api/basicData/processSettingss'
// import ProcessDialog from './process-dialog.vue'
import SourceArea from './source.vue'
import { getCooperativeData, getBimBusinessInfo } from '@/api/basicData/index'
import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
import { getcategoryTree } from '@/api/basicData/materialSettings' // 产品分类
import { getProcessList, detailProcess, } from '@/api/basicData/processSettingss'
import { addProductionResourceData, editProductionResource, detailProductionResourceData } from '@/api/basicData/productionResourceSetting'
import { getSurfaceTreatmentList, } from '@/api/financialManagement/index'
import { bimProductTypeConfig } from '@/api/expenseItem'
export default {
  components: {
    // ProcessDialog,
    SourceArea,

  },
  props: [],
  data() {
    return {
      getProductList, // 产品选择弹出框树状列表请求api
      platingList: [],
      ProductMethodArr: [
        { label: "物料分类", classAttribute: "material", method: getcategoryTree, requestObj: { classAttribute: "material" } },
        // { label: "其他分类", classAttribute: "other", method: getcategoryTree, requestObj: { classAttribute: "other" } }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        classAttribute: "",
        classAttributeList: ["raw_material", "semi_finished", "finish_product", "accessories"],
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
        productStatus: "enable",
        pageNum: 1,
        pageSize: 20,
        // queryType: 3
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '产品编码', fixed: 'left' },
        { prop: 'name', label: '产品名称', fixed: 'left' },
        { prop: 'drawingNo', label: '产品图号' },
        { prop: 'spec', label: '规格型号' },
        // { prop: 'routingName', label: '工艺路线名称', minWidth: 140 },
        // { prop: 'processName', label: '工序名称' },
        { prop: 'classAttributeText', label: '产品分类' },
        { prop: "mainUnit", label: "主单位" }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: "code", label: "产品编码", type: 'input' },
        { prop: "name", label: "产品名称", type: 'input' },
        { prop: "drawingNo", label: "产品图号", type: 'input' }
      ], // 产品选择弹出框搜索条件
      productVisibled: false,
      getProcessList,
      getProductList,
      getCooperativeData,
      activeName: 'jcInfo',
      dialogTitle: '',
      visible: false,
      processVisibled: false,
      sourceVisibled: false,
      loading: false,
      btnLoading: false,
      organizeIdTree: [],
      index: null,
      dataForm: {
        id: "",
        active: true,
        productsId: null, // 产品id
        productName: null, //产品名称
        productCode: null, //产品编码
        routingCode: null,  //工艺路线编码
        routingName: null,  // 工艺路线名称
        routingId: null,  // 工艺路线id
        remark: ''
      },
      routingParams: {
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "createTime"
        }],
        pageNum: 1,
        pageSize: -1,
        code: "",
        name: "",
        state: "",
        approvalStatus: "",
        createEndTime: "",
        createStartTime: "",
        documentStatus: '',
      },

      productParams: {
        code: "",
        classAttribute: "",
        orderItems: [{
          asc: false,
          column: 'createTime'
        }],
        pageNum: 1,
        pageSize: -1,
      },
      type: "",
      dataFormTwo: {
        data: []
      },
      dataFormArr: [],
      rules: {
        productName: [{
          required: true,
          message: '请选择产品名称',
          trigger: ['change']
        }],
        routingName: [{
          required: true,
          message: '请选择工艺路线名称',
          trigger: ['change']
        }],

      },
      rulesTwo: {
        standardHour: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate('bigInt', '请输入正确的数字', (errMsg) => { this.$message.error('标准工时' + errMsg) }), trigger: 'blur' },
          // { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('标准工时：不能为0') }), trigger: 'blur' }
        ],
        pricingType: [{ required: true, trigger: ['change'] }],
        rejectUnitPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('次品单价：' + errMsg) }] }), trigger: 'blur' },
          // { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('次品单价：不能为0') }), trigger: 'blur' }
        ],
        scrapUnitPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('废品单价：' + errMsg) }] }), trigger: 'blur' },
          // { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('废品单价：不能为0') }), trigger: 'blur' }
        ],
        timePrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('计时单价：' + errMsg) }] }), trigger: 'blur' },
          // { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('计时单价：不能为0') }), trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [10, 2, "", (errMsg) => { this.$message.error('正品单价：' + errMsg) }] }), trigger: 'blur' },
          // { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('正品单价：不能为0') }), trigger: 'blur' }
        ],
        platingCode: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["请选择电镀编码", (errMsg) => { this.$message.error('' + errMsg) }] }), trigger: 'change' },
          { required: true, trigger: ['blur'], message: "请选择电镀编码" },

        ]

      },
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      typeOptions: [],
      departmentList: [],
      cooperativeList: [],
      currntIndex: 0,
      types: "",
      sourceData: [],
      routingLineId: null,
      pricingTypeList: [
        {
          label: '计时',
          value: 'by_time'
        },
        {
          label: '计件',
          value: 'by_piece'
        },
      ],
      businessType: '',    // 业务开关获取类型
      priceDialog: false,

      depFormVisible: false,
      background: true,//分页器背景颜色
      visible: false,
      tableDataList: [],
      listLoading: false,
      tableQuery: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        name: "",
        code: "",
        startTime: "",
        endTime: "",
      },
      createTimeArr: [],
      total: 0,
      formVisible: false,
      productType: "",
      standardHourFlag: null,
    }
  },
  created() {
    getBimBusinessInfo(6).then(res => {
      console.log(res, '业务开关详情');
      this.businessType = res.data.currentValue
    })
  },
  methods: {
    initData() {
      getSurfaceTreatmentList(this.tableQuery).then(res => {
        // 
        console.log("电镀价格", res);
        this.tableDataList = res.data.records
        this.tableDataList.forEach(item => {
          let obj = {
            value: item.code,
            label: item.name,
          }
          this.platingList.push(obj)
        });
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },


    changePricingType(index, val) {
      console.log(111);
      console.log(val);
      if (val === 'by_piece') {
        this.dataFormTwo.data[index].timePrice = ''
      } else {
        this.dataFormTwo.data[index].rejectUnitPrice = ''
        this.dataFormTwo.data[index].scrapUnitPrice = ''
        this.dataFormTwo.data[index].unitPrice = ''
      }
    },
    //清除对比物料的值
    btnClearable(index, val) {
      this.dataFormTwo.data[index].productsId = ''
      this.dataFormTwo.data[index].productName = ''

    },
   async addth(id, data, params) {
      console.log(77777,params);
      if (params.type === 'dataFormProduct') {
        console.log(data, '选中的产品');
        if (data.length === 0) {
          this.$refs['elForm'].validateField('productName')
        } else {
          this.$refs['elForm'].fields[0].resetField()
          this.dataForm.productsId = data[0].id
          this.dataForm.productName = data[0].name
          this.dataForm.productCode = data[0].all.code
          this.productType = data[0].all.productType
        }
        const res = await bimProductTypeConfig()
              console.log("金工产品数据", res);
        let sFlag = true
        for (let index = 0; index < res.data.length; index++) {
            const item = res.data[index];
            if (item.productType == this.productType && item.businessCode == 'metalworking') {
              this.standardHourFlag = 2
              // sFlag = false
              // break
            } 
        }
      }
      if (params.type === 'dataFormTwoProduct') {
        console.log(data, '明细选择的产品');
        if (data.length === 0) {
          this.$set(this.dataFormTwo.data[params.index], 'productName', '')
          this.$set(this.dataFormTwo.data[params.index], 'productsId', '')
        } else {
          this.$set(this.dataFormTwo.data[params.index], 'productName', data[0].name)
          this.$set(this.dataFormTwo.data[params.index], 'productsId', data[0].id)
        }
      }
      // this.$refs['productForm'].resetFields()
    

    },



    // 选择工艺路线 过滤掉草稿状态的数据
    dataFormatting(res) {
      console.log(res, '过滤');
      let treeDataRount = res.data.records.filter(item => item.documentStatusName != '草稿')
      treeDataRount.forEach(item => {
        item.name = item.name + "(" + item.code + ")"
      });
      return treeDataRount

    },
    onOrganizeChangeTwo(val, data, paramsObj) {
      if (!val && data.length) return
      if (!data) return
      if (data.length === 0) {
        this.$refs['elForm'].validateField('routingName')
      } else {
        this.$refs['elForm'].fields[2].resetField()
        this.dataForm.routingId = data[0].id
        this.dataForm.routingName = data[0].name
        this.dataForm.routingCode = data[0].all.code
        //  通过选择的工艺路线 获取到相应的工序列表
        detailProcess(this.dataForm.routingId).then(res => {
          console.log(res, '工序');
          // this.dataFormTwo.data = res.data.bimRoutingLineVOList  //工艺明细
          this.dataFormTwo.data = res.data.bimRoutingLineVOList.map(item => {
            console.log("切换工艺", item);

            return {
              ...item,
              rejectUnitPrice: '',
              scrapUnitPrice: '',
              timePrice: '',
              unitPrice: '',
              pricingType: '',
              processCode: item.processVO.code,
              standardHour:item.processingType=="self_produced"?"":0,
            }
          })
          this.dataFormTwo.data.forEach((item, index) => {
            if (item.bimRoutingProcessResourceVOList && item.bimRoutingProcessResourceVOList.length) {
              item.bimRoutingProcessResourceVOList.forEach(ids => {
                if (ids.id) {
                  ids.id = ""
                }
              });
            }
            if (item.departmentName) {
              item.departmentName = item.departmentName.replace("[", "").replace("]", "").replace(/, /g, "/")
            }
            item.processType = item.processVO.processType
            item.processName = item.processVO.name
          })

          console.log(this.dataFormTwo.data, '111111');
        })
      }

    },


    clearData() {
      this.dataForm.id = ""
      this.dataFormTwo.data = []
    },
    goBack() {
      this.$emit('close')
    },
    init(id, type) {
      console.log(id, type);
      this.initData()
      // 此处判断用户选择新增还是编辑
      this.dataForm.id = id || ''
      this.visible = true
      this.dialogTitle = !this.dataForm.id ? '新建' : type == 'edit' ? '编辑' : `查看`
      this.type = type
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()

        if (!this.dataForm.id) {
          this.clearData()
        } else {
          this.loading = true
          detailProductionResourceData(this.dataForm.id).then(res => {
            console.log(res, '详情');
            this.dataForm = res.data.prodRes
            this.productType = res.data.prodRes.productType
            this.dataFormTwo.data = res.data.prodResLineList.map(item => {
              return {
                ...item,
                bimRoutingProcessResourceVOList: item.routingProResList
              }
            })
            console.log(this.dataFormTwo.data, 'Two');

            bimProductTypeConfig().then(res => {
              console.log("金工产品数据", res);
              for (let index = 0; index < res.data.length; index++) {
                const item = res.data[index];
                if (item.productType == this.productType && item.businessCode == 'metalworking') {
                  this.standardHourFlag = 2
                  break
                } else {
                  this.standardHourFlag = 1
                  
                }
              }

              console.log("this.standardHourFlag", this.standardHourFlag);
            })
            // this.dataFormArr = res.data.prodResLineList
            // console.log(this.dataFormArr, '生产资源配置明细列表');
            // detailProcess(this.dataForm.routingId).then(res => {
            //   console.log(res, '工序');
            //   this.dataFormTwo.data = res.data.bimRoutingLineVOList

            //   this.dataFormTwo.data.forEach((item, index) => {
            //     if (item.departmentName) {
            //       item.departmentName = item.departmentName.replace("[", "").replace("]", "").replace(/, /g, "/")
            //     }
            //     if (item.supplierName) {
            //       this.dataFormTwo.data[index].cooperativePartnerName = item.supplierName
            //     }
            //     this.dataFormTwo.data[index].bimRoutingProcessResourceVOList = [...this.dataFormArr[index].routingProResList]



            //     this.$set(this.dataFormTwo.data[index], 'standardHour', this.dataFormArr[index].standardHour);
            //     this.$set(this.dataFormTwo.data[index], 'pricingType', this.dataFormArr[index].pricingType);
            //     this.$set(this.dataFormTwo.data[index], 'processType', this.dataFormArr[index].processType);
            //     this.$set(this.dataFormTwo.data[index], 'platingCode', this.dataFormArr[index].platingCode);
            //     this.$set(this.dataFormTwo.data[index], 'platingName', this.dataFormArr[index].platingName);
            //     this.$set(this.dataFormTwo.data[index], 'rejectUnitPrice', this.dataFormArr[index].rejectUnitPrice);
            //     this.$set(this.dataFormTwo.data[index], 'scrapUnitPrice', this.dataFormArr[index].scrapUnitPrice);
            //     this.$set(this.dataFormTwo.data[index], 'timePrice', this.dataFormArr[index].timePrice);
            //     this.$set(this.dataFormTwo.data[index], 'unitPrice', this.dataFormArr[index].unitPrice);
            //     this.$set(this.dataFormTwo.data[index], 'actualHour', this.dataFormArr[index].actualHour);
            //     this.$set(this.dataFormTwo.data[index], 'productName', this.dataFormArr[index].productName)
            //     this.$set(this.dataFormTwo.data[index], 'productsId', this.dataFormArr[index].productsId)
            //     this.$set(this.dataFormTwo.data[index], 'processCode', this.dataFormArr[index].processCode)


            //     console.log(this.dataFormTwo.data[index].bimRoutingProcessResourceVOList, '侧面数据');
            //   })
            // })
            let ind = 0
            this.dataFormTwo.data.forEach(item => {
              item.index = ind++
            })
            this.loading = false
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.request()
    },

    async request() {
      if (this.type === 'add') {
        this.dataFormTwo.data.forEach((item, index) => {
          this.dataFormTwo.data[index].routingProcResList = []
          console.log(item.bimRoutingProcessResourceVOList, '明细数据');
          this.dataFormTwo.data[index].prodResLine = {
            active: item.active,
            processId: item.processId,
            standardHour: item.standardHour,
            pricingType: item.pricingType,
            rejectUnitPrice: item.rejectUnitPrice,
            scrapUnitPrice: item.scrapUnitPrice,
            timePrice: item.timePrice,
            platingCode: item.platingCode,
            unitPrice: item.unitPrice,
            routingLineId: item.id,
            routingId: item.routingId,
            productsId: item.productsId,
            productName: item.productName,
            platingCode:item.platingCode
            
            // id:this.dataFormArr ? this.dataFormArr[index].id : ''
          }
          if (item.bimRoutingProcessResourceVOList.length) {
            this.dataFormTwo.data[index].routingProcResList = [...item.bimRoutingProcessResourceVOList]
          }
        })
      }
      // console.log("this.dataFormArr[index]", this.dataFormArr);
      if (this.type === 'edit' || this.type === 'look') {
        this.dataFormTwo.data.forEach((item, index) => {
          // console.log("item",item,this.dataFormArr[index].id);
          this.dataFormTwo.data[index].routingProcResList = []
          console.log('明细数据',item);


          this.dataFormTwo.data[index].prodResLine = {
            active: item.active,
            processId: item.processId,
            standardHour: item.standardHour,
            pricingType: item.pricingType,
            rejectUnitPrice: item.rejectUnitPrice,
            scrapUnitPrice: item.scrapUnitPrice,
            timePrice: item.timePrice,
            unitPrice: item.unitPrice,
            actualHour: item.actualHour,
            routingId: item.routingId,
            productionResourceId: this.dataForm.id,
            productsId: item.productsId,
            productName: item.productName,
            routingLineId: item.routingLineId ? item.routingLineId : '',
            platingCode:item.platingCode,
            id:item.id

          }
          if (item.bimRoutingProcessResourceVOList.length) {
            this.dataFormTwo.data[index].routingProcResList = [...item.bimRoutingProcessResourceVOList]

          }
        })
      }
      this.btnLoading = true
      let _data = {
        prodRes: this.dataForm,
        prodResLineList: this.dataFormTwo.data
      }
      console.log(_data, '参数')
      console.log(this.$refs['productForm']);

      this.$refs['elForm'].validate(async (valid) => {
        if (valid) {
          let form_2 = this.$refs['productForm']
          let valid_2 = await form_2.validate().catch(err => false)
          console.log(valid_2);
          if (!valid_2) {
            console.log(1);
            this.btnLoading = false
            for (let i = 0; i < this.dataFormTwo.data.length; i++) {
              const item = this.dataFormTwo.data[i]
              if (!item.standardHour && this.standardHourFlag == 2&&item.processingType=='self_produced') {
                this.$message({
                  type: 'error',
                  message: '第' + (i + 1) + '行的标准工时不能为空、不能为0',
                  duration: 1500,
                })
                break
              }
              if (item.pricingType === 'by_piece') {

                if (!item.unitPrice) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的正品单价',
                    duration: 1500,
                  })
                  break
                }
                if (!item.rejectUnitPrice) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的次品单价',
                    duration: 1500,
                  })
                  break
                }
                if (!item.scrapUnitPrice) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的废品单价',
                    duration: 1500,
                  })
                  break
                }
              }
              if (item.pricingType === 'by_time') {
                if (!item.timePrice) {
                  this.$message({
                    type: 'error',
                    message: '请输入第' + (i + 1) + '行的计时单价',
                    duration: 1500,
                  })
                  break
                }
              }
            }
            // return
          } else {
            this.btnLoading = true
          }
          console.log(66666666);
          if (valid_2) {
            if (!this.dataForm.id) {
              addProductionResourceData(_data).then(res => {
                if (res.msg === 'Success') res.msg = '新建成功'
                this.$message({
                  message: res.msg,
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.visible = false
                    this.btnLoading = false
                    this.$emit('close', true)
                  }
                })
                // this.init(res.data)
                // this.visible = false
              }).catch(() => {
                this.btnLoading = false
              })
            } else {
              editProductionResource(_data).then((res) => {
                if (res.msg === 'Success') res.msg = '修改成功'
                this.$message({
                  message: res.msg,
                  type: 'success',
                  duration: 1000,
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
          }
        } else {
          this.btnLoading = false
        }

      })
    },
    submit(data) {
      if (data) {
        let ind = data.length
        console.log(data, this.index, 'data1111');
        if (this.dataFormTwo.data.length < 1) {
          let obj = {
            index: this.dataFormTwo.data.length,
            name: data.name, // 工序名称
            // routingId:

            routingProcResList: [],
            prodResLine: {
              processId: data.id,
              standardHour: data.standardHour,

            },
            reportFlag: 0, // 是否报工
            checkFlag: 0, // 是否检验
            processingType: data.processingType, // 加工类型
            cooperativePartnerId: null, // 合作伙伴id
            cooperativePartnerName: '',
            departmentId: null, // 部门id
            stockFlag: 0, // 是否入库
            firstInspection: 0, // 是否首检
            firstFlag: true, //是否首道工序
            lastFlag: true, // 是否末道工序

          }

          this.dataFormTwo.data.push(obj)

        } else {
          let obj = {
            index: this.dataFormTwo.data.length,
            name: data.name, // 工序名称
            // routingId:
            processId: data.id,
            routingProcResList: [],
            reportFlag: 0, // 是否报工
            checkFlag: 0, // 是否检验
            processingType: data.processingType, // 加工类型
            cooperativePartnerId: null, // 合作伙伴id
            cooperativePartnerName: '',
            departmentId: null, // 部门id
            stockFlag: 0, // 是否入库
            firstInspection: 0, // 是否首检
            firstFlag: false, //是否首道工序
            lastFlag: true, // 是否末道工序
          }
          // console.log("+++++", this.index);
          if (this.types == 'edit') {
            // this.dataFormTwo.data[this.index] = obj
            this.$set(this.dataFormTwo.data, this.index, obj)
          } else {
            this.dataFormTwo.data.push(obj)
          }
          console.log(this.dataFormTwo.data);
          this.$forceUpdate()
          this.dataFormTwo.data.forEach((item, index) => {
            if (index == this.dataFormTwo.data.length - 1) {
              item.lastFlag = true
            } else {
              item.lastFlag = false

            }
          });
          // this.dataFormTwo.data=this.dataFormTwo.data
        }

      } else {
        let ind = 0
        this.dataFormTwo.data = []
      }
    },
    // 删除项
    delequipment_process_relList(index) {
      this.dataFormTwo.data.splice(index, 1)
      this.dataFormTwo.data.forEach((item, index) => {
        if (index == 0) {
          item.firstFlag = true

        } else {
          item.firstFlag = false

        }
        if (index == this.dataFormTwo.data.length - 1) {
          item.lastFlag = true
        } else {
          item.lastFlag = false

        }
      });
    },
    // 工艺资源
    handlerOpenSource(index, type) {
      this.currntIndex = index
      this.sourceVisibled = true

      this.$nextTick(() => {
        this.$refs['sourceRef'].init([this.dataFormTwo.data[index]], type,this.dataForm.routingId)
      })

    },
    // 抽屉提交
    handlerConfirm(data) {
      console.log('1111111111111111111111111')
      console.log(data, '资源资源数据');

      this.dataFormTwo.data[this.currntIndex].routingProcResList = data
      this.dataFormTwo.data[this.currntIndex].bimRoutingProcessResourceVOList = data
      this.sourceVisibled = false
      console.log(this.dataFormTwo.data)
    },
  },
}
</script>
<style scoped>
::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.container {
  min-height: 100vh;
  background: #fff;
}

.main {
  padding: 10px;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

::v-deep .el-tabs__header {
  padding-left: 10px !important;
  padding-bottom: 10px !important;
  margin-bottom: 0 !important;
  background: #fff;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}

::v-deep .el-form-item__content p {
  border: none !important;
}

::v-deep .JNPF-preview-main .el-table--mini td {
  padding: 8px 0 !important;
}

::v-deep .el-input__suffix-inner {
  line-height: 32px !important;
}

.viewData {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>