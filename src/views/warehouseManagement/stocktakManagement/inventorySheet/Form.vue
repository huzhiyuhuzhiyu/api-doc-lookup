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
      <div class="contain">
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
                                style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择盘点日期"
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

                      <JNPF-table ref="product" :data="productData" :fixedNO="true" :hasC="btnType != 'look'"
                        @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">

                        <el-table-column prop="productName" label="产品名称" v-show="productNameFlag" min-width="160" />
                        <el-table-column prop="productCode" label="产品编码" width="160" :key="4" show-overflow-tooltip />
                        <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="stockNum" label="当前库存" width="120" :key="6" show-overflow-tooltip>
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
                              :method="getWarehouseList" :currentIndex="scope.$index" placeholder="请选择仓库"
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
                        <el-table-column label="操作" width="100" v-if="productData.length && btnType != 'look'"
                          fixed="right">
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
                            style="width: 100%;" :picker-options="pickerOptions" placeholder="请选择盘点日期"
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
                    @selection-change="handeleProductInfoData" border :key="165" style="width: 100%;">

                    <el-table-column prop="productName" label="产品名称" v-show="productNameFlag" min-width="160" />
                    <el-table-column prop="productCode" label="产品编码" width="160" :key="4" show-overflow-tooltip />
                    <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="stockNum" label="当前库存" width="120" :key="6" show-overflow-tooltip>
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
                    <el-input v-model="productForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="productForm.productName" placeholder="产品名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input v-model="productForm.productCode" placeholder="产品编码" clearable />
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
                @selection-change="handleSelectionChangeAllPruduct" ref="form">

                <el-table-column prop="drawingNo" label="品名规格" width="300" sortable="custom" />
                <el-table-column prop="name" label="产品名称" v-show="productNameFlag" min-width="160" sortable="custom" />
                <el-table-column prop="code" label="产品编码" width="140" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />

                <el-table-column prop="batchNumber" label="批次号" width="180" />
                <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom" />
                <el-table-column prop="oil" label="油脂" width="80" sortable="custom" />
                <el-table-column prop="oilQuantity" label="油脂量" width="100" sortable="custom" />
                <el-table-column prop="clearance" label="游隙" width="80" sortable="custom" />
                <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"></el-table-column>


                <el-table-column prop="remark" label="备注" width="160" sortable="custom" />
                <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom" />
              </JNPF-table>
              <pagination :total="productTotal" :page.sync="productForm.pageNum" :limit.sync="productForm.pageSize"
                @pagination="searchProductFun" />
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
          <div class="el-upload__tip" slot="tip">只能上传.xls/.xlsx文件 <el-button type="text" class="topButton"
              icon="el-icon-download" @click="downLoadTemplate">下载模板</el-button></div>

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

// import CustomerForm from './customerForm.vue'
import WareHouseForm from './wareHouseForm.vue'
import BatchNumberForm from './batchNumberForm.vue'
import { getBusinessFlowInfo, getBusinessFlowDetail } from '@/api/workFlow/FlowEngine'
import { mapGetters, mapState } from 'vuex'
import { excelExport } from '@/api/basicData/index'
import Adjust from '../inventoryAdjustmentSheet/Form.vue'
import { getProduct, addStocktak, detailStocktak, editStocktak, deleteStocktak, productExport, productImport, stockTakingToAdjus } from '@/api/warehouseManagement/stocktak.js'
import Process from '@/components/Process/Preview'
import flowMixin from '@/mixins/generator/flowMixin'
import recordList from '@/views/workFlow/components/RecordList.vue'
import busFlow from '@/mixins/generator/busFlow';
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  // components: { CustomerForm, WareHouseForm, BatchNumberForm, Process, recordList },
  components: { Process, recordList, WareHouseForm, BatchNumberForm, Adjust },
  mixins: [flowMixin, busFlow, getProjectList],
  data() {
    return {
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
        orderDate:""
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
    }
  },

  async created() {
    await this.getProjectSwitch('system', 'project')

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
  watch: {
    "dataForm.warehouseId": {
      handler: function (newVal, oldVal) {
        if (oldVal) this.spaceLines = []
      },
    }
  },

  methods: {
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
              this.$set(item, 'code', item.productsCode)
              this.$set(item, 'name', item.productsName)
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
      let productsIds = this.productData.map(item => item.id)
      console.log("productsIds", productsIds);
      productExport(productsIds).then(res => {
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
      this.index = ""
    },
    // 表单切换仓库
    changeWarehousex(val, data) {
      if (!val && !data.length) {
        this.dataForm.warehouseId = ''
        this.dataForm.warehouseName = ''
        this.dataForm.warehouseType = ""
        return
      }
      this.allocationFlag = data[0].all.locationStatus == 'disabled' ? false : true

      this.dataForm.warehouseId = data[0].id
      this.dataForm.warehouseName = data[0].name
      this.dataForm.warehouseType = data[0].all.type
      if (this.productData.length) {
        this.productData.forEach(item => {
          this.$set(item, 'allocationFlag', data[0].all.locationStatus == 'disabled' ? false : true)
          item.warehouseId = data[0].id
          item.warehouseName = data[0].name
          item.shelfSpaceName = ""
          item.shelfSpaceId = ""
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
        return
      }
      this.productData[index].warehouseId = data[0].id
      this.productData[index].warehouseName = data[0].name
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
      this.searchProductFun()
    },
    searchProductFun() {
      this.productForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getProduct(this.productForm).then(res => {
        this.productList = res.data.records
        this.productTotal = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })



    },
    // 选择产品 (销售发货——多选)
    handleSelectionChangeAllPruduct(val) {
      val.forEach(item => {
        this.$set(item, 'productName', item.name)
        this.$set(item, 'productCode', item.code)
      });
      this.selectSaleProductArr = val

    },
    // 选择产品——重置
    resetProductFun() {
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
      this.searchProductFun()

    },
    // 选完产品后  渲染在产品信息列表
    submitAllProduct() {
      if (!this.selectSaleProductArr.length) return this.$message.error("请选择产品！")
      this.productVisible = false
      let arr = JSON.parse(JSON.stringify(this.selectSaleProductArr))


      arr.forEach(item => {
        this.$set(item, 'stockNum', item.stockNum)
        this.$set(item, 'num', '')
        this.$set(item, 'diffNum', '')
        this.$set(item, 'shelfSpaceId', item.shelfSpaceId)
        this.$set(item, 'shelfSpaceName', item.shelfSpaceName)
        this.$set(item, 'batchNumber', item.shelfSpaceId)
        this.$set(item, 'productsId', item.id)
        this.$set(item, 'allocationFlag', item.locationStatus == 'disabled' ? false : true)
        if (this.dataForm.warehouseId) {
          this.$set(item, 'warehouseName', this.dataForm.warehouseName)
          this.$set(item, 'allocationFlag', this.allocationFlag)
          this.$set(item, 'warehouseId', this.dataForm.warehouseId)
        } else {
          this.$set(item, 'warehouseName', item.warehouseName)
          this.$set(item, 'allocationFlag', item.allocationFlag)
          this.$set(item, 'warehouseId', item.warehouseId)
        }
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
                warehouseId: item.warehouseId
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