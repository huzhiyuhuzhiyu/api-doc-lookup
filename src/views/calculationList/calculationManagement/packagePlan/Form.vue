<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack"
          :content="btnType == 'add' ? '新建包装计划' : btnType == 'edit' ? '编辑包装计划' : btnType == 'look' ? '查看包装计划' : ''" />
        <div class="options" v-if="btnType != 'look'">
          <el-button type="primary" :loading="btnLoading" @click="handleConfirm()">
            提交</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading" ref="main">

        <el-tabs v-model="activeName">
          <el-tab-pane label="包装计划单信息" name="orderInfo" ref="orderInfos">
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px">
              <h5>基本信息</h5>
            </div>
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="6" :xs="24">
                  <el-form-item label="计划模板" prop="templateCode">
                    <el-select @change="changeTemplate" v-model="dataForm.templateCode" placeholder="请选择计划模板"
                      style="width: 100%;" :disabled="btnType == 'look' ? true : false">
                      <el-option v-for="(item, index) in templateList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <!-- <el-col :sm="6" :xs="24">
                  <el-form-item label="销售订单" prop="ordersNo">
                    <ComSelect-page :beforeSubmit="beforeSubmit1" :beforeOpen="beforeOpen"
                      :isdisabled="btnType === 'look'" v-model="dataForm.ordersNo" ref="ComSelect-page"
                      @change="addsaleOrder" :placeholder="'请选择销售订单'" :tableItems="saleTableItems" title="选择销售订单"
                      :listMethod="getsaleOrderList" :listRequestObj="saleRequestObj" :searchList="saleTableSearchList"
                      :renderTree="false" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="工作令号" prop="workOrderNo">
                    <el-input v-model="dataForm.workOrderNo" placeholder="" disabled maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="6" :xs="24">
                  <el-form-item label="合同号" prop="contractNo">
                    <el-input v-model="dataForm.contractNo" placeholder="" disabled maxlength="50" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24">
                  <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="dataForm.remark" placeholder="" disabled maxlength="200"
                      :rows="3" />
                  </el-form-item>
                </el-col> -->


              </el-row>
            </el-form>
            <ComSelect-page :beforeSubmit="beforeSubmit1" :beforeOpen="beforeOpen" :isdisabled="btnType === 'look'"
              ref="ComSelect-page" @change="addsaleOrder" :placeholder="'请选择销售订单'" :tableItems="saleTableItems"
              title="选择销售订单" :listMethod="getsaleOrderList" :listRequestObj="saleRequestObj"
              :searchList="saleTableSearchList" :renderTree="false" :elementShow="false" multiple />
            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;margin-top: 10px;">
              <h5>订单信息</h5>
            </div>
            <div v-if="btnType !== 'look'">
              <el-button type="text" class="topButton" icon="el-icon-plus" @click="openSaleOrder">选择销售订单</el-button>|
              <el-button type="text" class="topButton" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
            </div>
            <el-form :model="dataFormTwoSale" v-bind="dataFormTwoSale" ref="dataFormTwoSale">
              <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwoSale.data"
                :data="dataFormTwoSale.data" id="table" @selection-change="handeleProductInfoData" hasC border
                ref="table">
                <el-table-column type="selection" width="60" fixed="left" align="center" v-if="btnType !== 'look'"
                  key="selection" />
                <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                <el-table-column prop="ordersNo" label="订单号" min-width="180" key="ordersNo" show-overflow-tooltip />
                <el-table-column prop="workOrderNo" label="工作令号" min-width="160" key="workOrderNo"
                  show-overflow-tooltip />
                <el-table-column prop="contractNo" label="合同号" min-width="160" key="contractNo" show-overflow-tooltip />
                <el-table-column prop="partnerCode" label="客户编码" min-width="140" key="partnerCode"
                  show-overflow-tooltip />
                <el-table-column prop="partnerName" label="客户名称" min-width="140" key="partnerName"
                  show-overflow-tooltip />

                <el-table-column prop="ordersRemark" label="备注" min-width="220" show-overflow-tooltip
                  key="ordersRemark" />
                <el-table-column prop="deliveryDate" label="交货日期" min-width="180" show-overflow-tooltip
                  key="deliveryDate" />

                <el-table-column label="操作" width="90" fixed="right" v-if="btnType != 'look'">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="JNPF-table-delBtn"
                      @click="delequipment_process_relList(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>



            <div
              style="line-height:33px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;"
              ref="box">
              <h5>包装计划单明细</h5>
            </div>
            <!-- 科尼模版 -->
            <div :style="{ height: customStyleData + 'px' }" key="kn"
              :class="['lineTable', btnType == 'look' ? 'nolineTable' : '']" v-if="dataForm.templateCode == 't002'"
              v-loading="listLoading" ref="boxresiz">
              <!-- <div class="left" ref="leftDom" :style="{ width: tableWidth + 'px' }"> -->
              <!-- <el-form :model="dataFormOne" v-bind="dataFormOne" ref="dataFormOne"> -->
              <vue-draggable-resizable :w="tableWidth || 1" :h="customStyleData" @resizing="handleResize"
                class-name="dragging1" axis="y" :y="0" :parent="true" :handles="['mr']">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormOne.data" ref="dataTableOne"
                  @selection-change="handeleAddt002" :data="dataFormOne.data" id="tableOne" @sort-change="sortChange"
                  :header-cell-class-name="handleHeaderCellClass" :height="customStyleData + 'px'" border @row-click="handleRowClick002">
                  <el-table-column type="selection" width="60" :selectable="checkSelectable" fixed="left" align="center"
                    v-if="btnType != 'look'" key="selection" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                  <el-table-column prop="customerProductNo" label="客户物料号" min-width="180" key="customerProductNo"
                    show-overflow-tooltip sortable="custom" />
                  <el-table-column prop="customerProductDrawingNo" label="客户图号" min-width="180"
                    key="customerProductDrawingNo" show-overflow-tooltip sortable="custom" />
                  <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" key="productDrawingNo"
                    show-overflow-tooltip sortable="custom" />
                  <el-table-column prop="contractNo" label="合同号" min-width="160" key="contractNo" show-overflow-tooltip />
                  <el-table-column prop="mainUnit" label="单位" min-width="140" key="mainUnit" show-overflow-tooltip />
                  <el-table-column prop="num" label="数量" min-width="140" key="num" show-overflow-tooltip />
                  <el-table-column prop="itemNumber" label="项次" min-width="120" key="itemNumber" show-overflow-tooltip
                    sortable="custom" />
                  <el-table-column prop="ask" label="要求" sortable="custom" min-width="140" key="ask"
                    show-overflow-tooltip />
                  <el-table-column prop="vehicleGroup" label="组别" sortable="custom" min-width="140" key="vehicleGroup"
                    show-overflow-tooltip />
                  <el-table-column prop="op2" label="OP*" sortable="custom" min-width="140" key="op2"
                    show-overflow-tooltip />
                  <el-table-column prop="ordersLineRemark" label="备注1" min-width="140" show-overflow-tooltip
                    key="ordersLineRemark" sortable="custom" />
                  <el-table-column prop="ordersLineRemark2" label="备注2" min-width="140" show-overflow-tooltip
                    key="ordersLineRemark2" sortable="custom" />
                </el-table>
              </vue-draggable-resizable>
              <!-- </el-form> -->
              <!-- </div> -->
              <div class="lineCenter" v-if="btnType !== 'look'" :style="{ width: btnWidth + 'px' }">
                <el-button @click="addT" class="lineBtn">添加</el-button>
                <el-button type="danger" class="lineBtn" @click="delT">移除</el-button>
              </div>
              <div class="right" ref="rightDom" :style="{ width: tableWidth2 + 'px' }">
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="dataFormTwo">
                  <vue-draggable-resizable :w="tableWidth2 || 1" :h="customStyleData" class-name="dragging2"
                    :draggable="false" :parent="true" :resizable="false">
                    <el-table style="border: 1px solid #e3e7ee;width: 100%" hasNO fixedNO v-bind="dataFormTwo.data" ref="dataFormKn"
                      :data="dataFormTwo.data" id="tableTwo" @selection-change="handelt002" 
                      :height="customStyleData + 'px'" border>
                      <el-table-column type="selection" width="60" :selectable="checkSelectable" fixed="left"
                        align="center" v-if="btnType != 'look'" key="selection" />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                      <el-table-column prop="torrNo" label="组号" min-width="120" key="torrNo" />
                      <el-table-column prop="packingMark" label="装箱标识" min-width="140"  key="packingMark">
                        <template slot-scope="scope" v-if="scope.row.torrNo">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'packingMark'" :rules='productRules.packingMark'>
                            <el-input @change="changeMark(scope)" v-model="scope.row.packingMark" maxlength="5" :disabled="btnType === 'look'"
                              placeholder="请输入装箱标识" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="customerProductNo" label="物料号" min-width="180" show-overflow-tooltip
                        key="customerProductNo" />
                      <el-table-column prop="customerProductDrawingNo" label="客户图号" min-width="180" show-overflow-tooltip
                        key="customerProductDrawingNo" />
                      <el-table-column prop="ask" label="OP" min-width="140" show-overflow-tooltip key="ask" />
                      <el-table-column prop="mainUnit" label="单位" min-width="140" show-overflow-tooltip key="mainUnit" />
                      <el-table-column prop="num" label="数量" min-width="140" show-overflow-tooltip key="num" />
                      <el-table-column prop="contractNo" label="合同号" min-width="160" show-overflow-tooltip
                        key="contractNo" />
                      <el-table-column prop="itemNumber" label="项次" min-width="100" show-overflow-tooltip
                        key="itemNumber" />
                      <el-table-column prop="vehicleGroup" label="组别" min-width="140" fixed="right" key="vehicleGroup">
                        <!-- <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'group'">
                          <el-input v-model="scope.row.group" maxlength="10" :disabled="btnType === 'look'"
                            placeholder="请输入组别" />
                        </el-form-item>
                      </template> -->
                      </el-table-column>
                      <el-table-column prop="op2" label="OP*" min-width="140" fixed="right" key="op2">
                        <!-- <template slot-scope="scope">
                        <el-form-item :prop="'data.' + scope.$index + '.' + 'op2'">
                          <el-input v-model="scope.row.op2" maxlength="10" :disabled="btnType === 'look'"
                            placeholder="请输入OP*" />
                        </el-form-item>
                      </template> -->
                      </el-table-column>
                    </el-table>
                  </vue-draggable-resizable>
                </el-form>
              </div>
            </div>
            <!-- 通用模板 -->
            <div :style="{ height: customStyleData + 'px' }" key="ty"
              :class="['lineTable', btnType == 'look' ? 'nolineTable' : '']" v-if="dataForm.templateCode == 't001'"
              v-loading="listLoading" ref="boxresiz">
              <!-- <div class="left" :style="{ width: tableWidth + 'px' }"> -->
              <!-- <el-form :model="dataFormOne" v-bind="dataFormOne" ref="dataFormOne"> -->
              <vue-draggable-resizable :w="tableWidth || 1" :h="customStyleData" @resizing="handleResize"
                class-name="dragging1" axis="y" :y="0" :parent="true" :handles="['mr']">
                <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormOne.data"
                  @selection-change="handeleAddt001" :data="dataFormOne.data" id="tableOne" ref="dataTableOne"
                  @sort-change="sortChange" :header-cell-class-name="handleHeaderCellClass" @row-click="handleRowClick"
                  :height="customStyleData + 'px'" border>
                  <el-table-column type="selection" :selectable="checkSelectable" width="60" fixed="left" align="center"
                    v-if="btnType != 'look'" key="selection" />
                  <el-table-column type="index" width="60" label="序号" align="center" fixed="left" key="index" />
                  <el-table-column prop="customerProductNo" label="客户物料号" min-width="180" key="customerProductNo"
                    show-overflow-tooltip sortable="custom" />
                  <el-table-column prop="customerProductDrawingNo" label="客户图号" min-width="180"
                    key="customerProductDrawingNo" show-overflow-tooltip sortable="custom" />
                  <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" key="productDrawingNo"
                    show-overflow-tooltip sortable="custom" />
                  <el-table-column prop="contractNo" label="合同号" min-width="160" key="contractNo" show-overflow-tooltip />
                  <el-table-column prop="mainUnit" label="单位" min-width="140" key="mainUnit" show-overflow-tooltip />
                  <el-table-column prop="num" label="数量" min-width="140" key="num" show-overflow-tooltip />
                  <el-table-column prop="itemNumber" label="项次" min-width="120" key="itemNumber" show-overflow-tooltip
                    sortable="custom" />
                  <el-table-column prop="ask" label="要求" sortable="custom" min-width="140" key="ask"
                    show-overflow-tooltip />
                  <el-table-column prop="ordersLineRemark" label="备注1" min-width="140" show-overflow-tooltip
                    key="ordersLineRemark" sortable="custom" />
                  <el-table-column prop="ordersLineRemark2" label="备注2" min-width="140" show-overflow-tooltip
                    key="ordersLineRemark2" sortable="custom" />
                </el-table>
              </vue-draggable-resizable>
              <!-- </el-form> -->
              <!-- </div> -->
              <div class="lineCenter" v-if="btnType !== 'look'" :style="{ width: btnWidth + 'px' }">
                <el-button @click="addT" class="lineBtn">添加</el-button>
                <el-button type="danger" class="lineBtn" @click="delT">移除</el-button>
              </div>
              <div class="right" :style="{ width: tableWidth2 + 'px' }">
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="dataFormTwo">
                  <vue-draggable-resizable :w="tableWidth2 || 1" :h="customStyleData" class-name="dragging2" :x="10"
                    :draggable="false" :parent="true" :resizable="false">
                    <el-table style="border: 1px solid #e3e7ee;" hasNO fixedNO v-bind="dataFormTwo.data" ref="dataTableTwo"
                      :data="dataFormTwo.data" @selection-change="handelt001" id="tableTwo" 
                      :height="customStyleData + 'px'" border>
                      <el-table-column type="selection" width="60" fixed="left" :selectable="checkSelectable"
                        align="center" v-if="btnType != 'look'" key="selection" show-overflow-tooltip />
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left"
                        show-overflow-tooltip />
                      <el-table-column prop="torrNo" label="组号" min-width="120" />
                      <el-table-column prop="packingMark" label="装箱标识" min-width="140"  key="packingMark">
                        <template slot-scope="scope" v-if="scope.row.torrNo">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'packingMark'" :rules='productRules.packingMark'>
                            <el-input @change="changeMark(scope)" v-model="scope.row.packingMark" maxlength="5" :disabled="btnType === 'look'"
                              placeholder="请输入装箱标识" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="productDrawingNo" label="产品图号" min-width="180" show-overflow-tooltip />
                      <el-table-column prop="workOrderNo" label="工作令号" min-width="180" show-overflow-tooltip />
                      <el-table-column prop="itemNumber" label="项次" min-width="120" show-overflow-tooltip />
                      <el-table-column prop="customerProductNo" label="客户物料号" min-width="180" show-overflow-tooltip />
                      <el-table-column prop="mainUnit" label="单位" min-width="140" show-overflow-tooltip />
                      <el-table-column prop="num" label="数量" min-width="140" show-overflow-tooltip />
                      <el-table-column prop="pressure" label="压力" min-width="140" show-overflow-tooltip fixed="right">
                        <template slot-scope="scope" v-if="!scope.row.isShow">
                          <el-form-item :prop="'data.' + scope.$index + '.' + 'pressure'">
                            <el-input v-model="scope.row.pressure" maxlength="20" :disabled="btnType === 'look'"
                              placeholder="请输入压力" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="contractNo" label="合同号" min-width="160" show-overflow-tooltip />
                      <el-table-column prop="ask" label="要求" min-width="140" show-overflow-tooltip />
                      <el-table-column prop="ordersLineRemark2" label="备注2" min-width="140" show-overflow-tooltip />
                      <el-table-column prop="ordersRemark" label="订单主表备注" min-width="140" show-overflow-tooltip />
                    </el-table>
                  </vue-draggable-resizable>
                </el-form>
              </div>
            </div>

          </el-tab-pane>

        </el-tabs>
      </div>
      <el-dialog title="添加组" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
        lock-scroll class="torrNo" width="1000px" center append-to-body :before-close="closeTorrno">
        <el-row :gutter="20">

          <el-form ref="diaForm" :model="linesQuery" label-width="120px" label-position="top" :rules="torrNoRule">
            <el-col :span="12">
              <el-form-item label="组号" prop="torrNo">
                <el-input v-model="linesQuery.torrNo" placeholder="请输入组号" maxlength="5" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="装箱标识" prop="packingMark">
                <el-input v-model="linesQuery.packingMark" placeholder="请输入装箱标识" maxlength="5" />
              </el-form-item>
          </el-col>
          </el-form>
        </el-row>

        <span slot="footer" class="dialog-footer">
          <el-button style="margin:10px" type="primary" @click="sureRight()">
            确定
          </el-button>
          <el-button style="margin:10px" @click="closeTorrno">{{ $t('common.cancelButton') }}</el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>

import { getcategoryTrees, getOrderDetail, getsaleOrderList, getsaleOrderDetailList } from '@/api/salesManagement/assemblyOrders'
import { getCooperativeData } from '@/api/basicData/index'
import { addPackplan, updatePackplan, packPlabDetail, packSaleLineList } from '@/api/calculationList/packagePlan'
import TableFormProduct from './TableForm-product/index' // 产品选择组件
import VueDraggableResizable from "vue-draggable-resizable"
import "vue-draggable-resizable/dist/VueDraggableResizable.css"
export default {
  components: { TableFormProduct, VueDraggableResizable },

  data() {
    return {
      linesQuery: {
        torrNo: '',
        packingMark:'',
      },
      visible: false,
      getsaleOrderList,   //销售订单列表数据
      templateList: [
        { label: '通用模板', value: 't001' },
        { label: '科尼模板', value: 't002' },
      ],
      dataForm: {
        cooperativePartnerId: '',
        ordersId: '',
        ordersNo: '',
        orderNo:'',
        templateCode: '',
        workOrderNo: '',
        remark: '',
        id: '',
      },
      dataFormOne: {
        data: []
      },
      dataFormTwo: {
        data: []
      },
      dataFormTwoSale: {
        data: []
      },
      saleTableItems: [
        { prop: 'orderNo', label: '订单号', fixed: 'left' },
        { prop: 'workOrderNo', label: '工作令号' },
        { prop: 'contractNo', label: '合同号' },
        { prop: 'cooperativePartnerCode', label: '客户编码' },
        { prop: 'cooperativePartnerName', label: '客户名称' },
        { prop: 'remark', label: '备注' },
        { prop: 'deliveryDate', label: '交货日期' },
      ],
      saleTableSearchList: [
        { prop: "orderNo", label: "订单号", type: 'input' },
        { prop: "workOrderNo", label: "工作令号", type: 'input' },
        { prop: "cooperativePartnerCode", label: "客户编码", type: 'input' },
        { prop: "cooperativePartnerName", label: "客户名称", type: 'input' },
      ],
      saleRequestObj: {
        orderNo: "",
        cooperativePartnerCode: "",
        cooperativePartnerName: "",
        documentStatus: "submit",
        orderType: "",
        salesName: "",
        workOrderNo: "",
        sourceOrderNo: "",
        orderStartDate: "",
        orderEndDate: "",
        contractNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        orderState: "",
        productionStatus: "",
        documentStatus: "",
        approvalStatus: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        hidePackaging:1,    // 选择未包装计划的销售订单标识
      },
      activeNameTable: "",
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataRule: {
        ordersNo: [
          { required: true, message: '请选择销售订单', trigger: 'change' }
        ],
        templateCode: [
          { required: true, message: '请选择计划模板', trigger: 'change' },
        ],
      },
      torrNoRule: {
        torrNo: [
          { required: true, message: '请输入组号', trigger: 'blur' },
          { validator: this.torrNoValidate(), trigger: 'blur' },
        ],
        packingMark: [
          { validator: this.formValidate('number'), trigger: 'blur' },
        ],
      },
      tyData: [],  // 通用 添加
      tyDelData: [],  // 通用 删除
      knData: [],  // 科尼
      knDelData: [],  // 科尼
      count: 1,
      // 子表销售明细参数
      saleLineQuery: {
        // orderCategory: "",
        // cooperativePartnerCode: "",
        // cooperativePartnerName: "",
        // customerProductDrawingNo: "",
        // orderNo: "",
        // productCode: "",
        // productName: "",
        // drawingNo: "",
        // ordersId: '',
        // deliveryDateArr: [],
        // pageNum: 1,
        // pageSize: -1,
        // orderItems: [{
        //   asc: false,
        //   column: ""
        // }, {
        //   asc: false,
        //   column: "t1.create_time"
        // }],
        createByName: "",
        endTime: "",
        endUpdateTime: "",
        keyword: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "t1.create_time"
        }],
        ordersIdLine: [],
        pageNum: 1,
        pageSize: -1,
        startTime: "",
        startUpdateTime: "",
        templateCode: "",
        totalRowFlag: false
      },
      // 排序数组
      sortArr: [{
        asc: false,
        column: "t1.create_time"
      }],
      sortField: {},
      templateVal: '',
      listLoading: false,
      customStyleData: 0,
      templateCode: '',
      tableWidth: 700,
      tableWidth2: 0,
      btnWidth: 100,
      productArr: [],
      ordersIdLineArr: [],
      sureFlag: false,
      productRules: {
        packingMark: [
          { validator: this.formValidate('number','请输入正确的整数',(errMsg, index)=>{this.$message.error(`包装计划明细第${index + 1}行：装箱标识${errMsg}`)}), trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.switchStyleheight()
    this.switchStyle()
    // 页面发生缩放，触发明细表格表单的resize
    this.clientResize = () => {
      if (!this.$refs.table) return
      this.$nextTick(() => { this.$refs.table.doLayout() })
    }
    window.addEventListener('resize', this.clientResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.clientResize)
  },
  methods: {
    cbPack(msg,index){

    },
    openSaleOrder() {
      this.$refs['ComSelect-page'].openDialog()
    },
    // 选中的订单信息
    handeleProductInfoData(val) {
      this.productArr = val
    },
    // 批量删除
    async batchDelete() {
      // 遍历选中的行的数据
      if (this.productArr.length === 0) {
        this.$message({
          message: "请选择你要删除的数据",
          type: "error",
          duration: 1500,
        })
        return
      }
      if (this.dataFormOne.data.length && this.dataFormTwo.data.length) {
        this.listLoading = true
        await this.$confirm('已有包装计划信息，删除销售订单将清空包装计划信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.listLoading = false
          this.dataFormTwo.data = []
          this.dataFormOne.data = this.dataFormOne.data.filter(item1 => this.productArr.every(a => a.ordersId !== item1.ordersId))
          this.dataFormTwoSale.data = this.dataFormTwoSale.data.filter(item1 => this.productArr.every(a => a.ordersId !== item1.ordersId))
          // for (let i = 0; i < this.productArr.length; i++) {
          //   const row = this.productArr[i];
          //   const index = this.dataFormTwoSale.data.indexOf(row);
          //   if (index > -1) {
          //     this.dataFormTwoSale.data.splice(index, 1); // 从tableData中删除选中的行
          //   }
          // }
          // 添加后  禁用 不可以再次添加
          this.isAddOrDel()
          this.productArr = []  // 清空选中的行的数据
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.listLoading = false
        })
      } else if (this.dataFormOne.data.length) {
        this.dataFormOne.data = this.dataFormOne.data.filter(item1 => this.productArr.every(a => a.ordersId !== item1.ordersId))
        this.dataFormTwoSale.data = this.dataFormTwoSale.data.filter(item1 => this.productArr.every(a => a.ordersId !== item1.ordersId))
      }

    },
    // 删除项
    async delequipment_process_relList(index) {
      if (this.dataFormOne.data.length && this.dataFormTwo.data.length) {
        this.listLoading = true
        await this.$confirm('已有包装计划信息，删除销售订单将清空包装计划信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.dataFormTwo.data = []
          this.dataFormOne.data = this.dataFormOne.data.filter(item1 => item1.ordersId !== this.dataFormTwoSale.data[index].ordersId)
          this.listLoading = false
          this.dataFormTwoSale.data.splice(index, 1)
          // 添加后  禁用 不可以再次添加
          this.isAddOrDel()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.listLoading = false
        })
      } else if (this.dataFormOne.data.length) {
        this.dataFormOne.data = this.dataFormOne.data.filter(item1 => item1.ordersId !== this.dataFormTwoSale.data[index].ordersId)
        this.dataFormTwoSale.data.splice(index, 1)
      }
    },
    beforeOpen() {
      let flag = true
      if (!this.dataForm.templateCode) {
        flag = false
        this.$message.error('请先选择计划模版！')
      }
      return flag
    },
    // 有计划信息后 切换模版
    async changeTemplate(value) {
      if (this.dataFormOne.data.length && this.dataFormTwo.data.length) {
        this.listLoading = true
        await this.$confirm('已有包装计划信息，切换计划模版将清空包装计划信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.dataFormTwo.data = []
          this.dataFormOne.data.forEach(item1 => {
            item1.disabled = false
          });
          this.listLoading = false
          this.linesQuery.torrNo = ''
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.dataForm.templateCode = this.templateVal
          this.listLoading = false
        })
      } else if (this.dataFormOne.data.length) {
        this.listLoading = true
        await this.$confirm('已有包装计划信息，切换计划模版将更新包装计划信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '更新成功!'
          });
          this.saleLineData(this.ordersIdLineArr)
          this.listLoading = false
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          this.dataForm.templateCode = this.templateVal
          this.listLoading = false
        })
      }
      this.templateVal = value
    },
    checkSelectable(row) {
      if (row) return !row.disabled

    },
    // 组号校验 前两位限制
    torrNoValidate() {
      return (rule, value, callback) => {
        let msg = ''
        let reg = new RegExp(`/^NO\d{0,2}$/`);
        msg = msg || `请输入正确的组号，组号规则：NO+非0数字`
        let flag = false
        if (value) {
          if (value[0] + value[1] == 'NO') {
            if (value[2] && !isNaN(value[2]) && value[2] != ' ' && value[2] != '0') {
              flag = true
              if (value[3]) {
                if (!isNaN(value[3]) && value[3] != ' ') {
                  flag = true
                  if (value[4]) {
                    if (!isNaN(value[4]) && value[4] != ' '){
                      flag = true
                    }else{
                      flag = false
                    }
                  } else {
                    flag = true
                  }
                } else {
                  flag = false
                }
              } else {
                flag = true
              }

            } else {
              flag = false
            }
          } else {
            flag = false
          }
        } else {
          flag = true
        }
        if (flag) {
          callback()
        } else {
          callback(new Error(msg));
        }
      };
    },
    // 已有订单明细 切换订单
    async beforeSubmit1(data, paramsObj) {
      let flag = true
      if (this.dataFormOne.data.length && this.dataFormTwo.data.length) {
        flag = await this.$confirm('已有包装计划信息，切换销售订单将清空包装计划信息，您是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '清空成功!'
          });
          this.dataFormTwo.data = []
          return true
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
          return false
        })
      }
      return flag
    },
    addsaleOrder(id, data) {
      if (!data.length) {
      } else {
        let selectArr = data.map(item => item.all)
        selectArr = selectArr.map(item => {
          return {
            ...item,
            ordersId: item.id,
            ordersNo: item.orderNo,
            ordersRemark: item.remark,
            partnerCode: item.cooperativePartnerCode,
            partnerName: item.cooperativePartnerName,
            id: null,
          }
        })
        if (this.dataFormTwoSale.data.length) {
          const deletedArray = [];
          selectArr = selectArr.filter(item1 => {
            const index = this.dataFormTwoSale.data.findIndex(item2 => item2.ordersId === item1.ordersId);
            if (index !== -1) {
              deletedArray.push(item1.orderNo);
              if (deletedArray.length) {
                this.$message.error(`已经添加过的销售订单：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          });
        }
        this.dataFormTwoSale.data = [...this.dataFormTwoSale.data, ...selectArr]

        this.ordersIdLineArr = this.dataFormTwoSale.data.map(item => item.ordersId)


        // this.dataForm.ordersId = data[0].all.id
        // this.dataForm.ordersNo = data[0].all.orderNo
        // this.dataForm.cooperativePartnerId = data[0].all.cooperativePartnerId
        // this.dataForm.contractNo = data[0].all.contractNo
        // this.dataForm.workOrderNo = data[0].all.workOrderNo
        // this.dataForm.remark = data[0].all.remark
        this.saleLineData(this.ordersIdLineArr)
      }
    },
    // 明细数据
    saleLineData(lineIds) {
      this.saleLineQuery.ordersIdLine = lineIds
      this.saleLineQuery.templateCode = this.dataForm.templateCode
      packSaleLineList(this.saleLineQuery).then(res => {
        if (res.data.records) {
          this.dataFormOne.data = []
          this.dataFormOne.data = res.data.records.map(item => {
            return {
              ...item,
              productDrawingNo: item.drawingNo,
              contractNo: item.contractNo,
              workOrderNo: item.workOrderNo,
              disabled: false,
              ordersRemark: item.ordersRemark,
              ordersLineId: item.id,
              id: null,
              ordersLineRemark: item.remark,
              ordersLineRemark2: item.remark2,
              vehicleGroup: item.vehicleGroup,
              op2: item.vehicleOp2,
            }
          })
          // 左明细按钮禁用
          this.isAddOrDel()
        }
      })
    },
    // 多列排序
    sortChange({ order, prop }) {
      if (!this.dataFormOne.data.length) return
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null
        delete this.sortField[prop]
      } else {
        this.sortField[prop] = order
      }
      this.sortArr = []
      let direction = ''
      for (const i in this.sortField) {
        const item = i
        if (this.sortField[item] == 'ascending') {
          direction = 'ascending'
        } else if (this.sortField[item] == 'descending') {
          direction = 'descending'
        }
        let newProp
        if (item === 'cooperativePartnerName' || item === 'cooperativePartnerCode' || item === 'sealingRingName' || item === 'productCode' || item === 'productName' || item === 'documentStatus' || item === 'approvalStatus' || item === 'vehicleGroup') {
          newProp = item
        } else {
          newProp = item.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
          newProp = newProp == 'product_drawing_no' ? 'drawing_no' : newProp == 'orders_line_remark' ? 'remark' : newProp == 'orders_line_remark2' ? 'remark2' : newProp
        }
        this.sortArr.push({
          "column": this.sortField[prop] === null ? "" : newProp,
          "asc": direction === "ascending"
        })
      }
      this.sortArr.push({ asc: false, column: "t1.create_time" })
      this.saleLineQuery.orderItems = this.sortArr
      this.saleLineData(this.ordersIdLineArr) //调用后端查询接口
    },
    // 设置列的排序为我们自定义的排序
    handleHeaderCellClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    // 科尼模版 添加项
    handeleAddt002(val) {
      this.knData = val
    },
    // 科尼模版 进行删除项
    handelt002(val) {
      this.knDelData = val
    },
    // 选择通用模板 添加项
    handeleAddt001(val) {
      this.tyData = val
    },
    // 选择通用模板 进行删除项
    handelt001(val) {
      this.tyDelData = val
    },
    // 添加
    addT() {
      // 通用
      if (this.dataForm.templateCode == 't001') {
        if (this.tyData.length) {

          if (this.dataFormTwo.data.length) {
            let NoNum = this.linesQuery.torrNo.split('O')[1]
            NoNum++
            this.linesQuery.torrNo = 'NO' + NoNum
          } else {
            this.linesQuery.torrNo = 'NO' + 1
          }
          this.visible = true
          this.$nextTick(() => {
            this.$refs['diaForm'].clearValidate()
          })
        } else {
          this.$message.error('请先选择您要添加的数据！')
        }
      }
      // 科尼
      if (this.dataForm.templateCode == 't002') {
        if (this.knData.length) {
          if (this.dataFormTwo.data.length) {
            let NoNum = this.linesQuery.torrNo.split('O')[1]
            NoNum++
            this.linesQuery.torrNo = 'NO' + NoNum
          } else {
            this.linesQuery.torrNo = 'NO' + 1
          }
          this.visible = true
          this.$nextTick(() => {
            this.$refs['diaForm'].clearValidate()
          })
        } else {
          this.$message.error('请先选择您要添加的数据！')
        }
      }
    },
    // 添加函数 通用 科尼 共用
    addRightAll(type, arr) {
      let rightData = []
      if (type == 't001') {
        rightData = this.tyData.map(item => {
          return {
            ...item,
            pressure: '',
            torrNo: this.linesQuery.torrNo,
            packingMark: this.linesQuery.packingMark,
            disabled: false
          }
        })
      }
      if (type == 't002') {
        rightData = this.knData.map(item => {
          return {
            ...item,
            torrNo: this.linesQuery.torrNo,
            packingMark: this.linesQuery.packingMark,
            disabled: false
          }
        })
      }

      // 判断传递的数据 组号是否存在 存在的话 往后插入数据
      if (this.dataFormTwo.data.length) {
        rightData.forEach(item => {
          var index = this.dataFormTwo.data.map(obj => obj.torrNo).lastIndexOf(item.torrNo);
          if (index !== -1) {
            this.dataFormTwo.data.splice(index + 1, 0, item);
          }
        });
      }
      this.dataFormTwo.data = [...this.dataFormTwo.data, ...rightData]
      this.dataFormTwo.data = [...new Set(this.dataFormTwo.data)]
      // 排序
      this.dataFormTwo.data.sort(function (a, b) {
        var torrNoA = parseInt(a.torrNo.replace('NO', ''));
        var torrNoB = parseInt(b.torrNo.replace('NO', ''));
        return torrNoA - torrNoB;
      });
      // 在每一组后面添加空行
      let newData = [];
      let prevTorrNo = null;
      this.dataFormTwo.data = this.dataFormTwo.data.filter(item => !item.isShow)
      this.dataFormTwo.data.forEach(item => {
        if (prevTorrNo !== null && item.torrNo !== prevTorrNo) {
          newData.push({
            isShow: true,
            torrNo: '',
            packingMark: '',
            productDrawingNo: '',
            workOrderNo: '',
            itemNumber: '',
            customerProductNo: '',
            mainUnit: '',
            num: '',
            pressure: '',
            contractNo: '',
            ask: '',
            op2: '',
            vehicleGroup: '',
            ordersLineRemark2: '',
            disabled: true
          });
        }
        newData.push(item);
        prevTorrNo = item.torrNo;
      });
      this.dataFormTwo.data = [...new Set(newData)]

      this.$refs.dataTableOne.clearSelection();
    },
    // 向右边添加
    sureRight() {
      this.visible = false
      this.sureFlag = true
      this.$refs['diaForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.templateCode == 't001') {
            this.addRightAll(this.dataForm.templateCode, this.tyData)
          }
          if (this.dataForm.templateCode == 't002') {
            this.addRightAll(this.dataForm.templateCode, this.knData)
          }
          // 添加后  禁用 不可以再次添加
          this.isAddOrDel()
          this.updatePackingMarkByTorrNo(this.linesQuery.torrNo, this.linesQuery.packingMark)
        } else {
          this.visible = true
        }
      })
    },
    closeTorrno(){
      this.visible = false
      this.sureFlag = false
      if (this.linesQuery.torrNo){
        let NoNum = this.linesQuery.torrNo.split('O')[1]
        if (Number(NoNum)){
          this.linesQuery.torrNo = "NO" + (NoNum - 1)
        }
      }
    },
    // 移除
    delT() {
      if (this.dataForm.templateCode == 't001') {
        if (this.tyDelData.length) {
          for (let i = 0; i < this.tyDelData.length; i++) {
            const row = this.tyDelData[i];
            const index = this.dataFormTwo.data.indexOf(row);
            if (index > -1) {
              this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
              // 在每一组后面添加空行
              let newData = [];
              let prevTorrNo = null;
              this.dataFormTwo.data = this.dataFormTwo.data.filter(item => !item.isShow)
              if (this.dataFormTwo.data.length) {
                this.dataFormTwo.data.forEach(item => {
                  if (prevTorrNo !== null && item.torrNo !== prevTorrNo) {
                    newData.push({
                      isShow: true,
                      torrNo: '',
                      packingMark: '',
                      productDrawingNo: '',
                      workOrderNo: '',
                      itemNumber: '',
                      customerProductNo: '',
                      mainUnit: '',
                      num: '',
                      pressure: '',
                      contractNo: '',
                      ask: '',
                      ordersLineRemark2: '',
                      disabled: true
                    });
                  }
                  newData.push(item);
                  prevTorrNo = item.torrNo;
                });
                this.dataFormTwo.data = [...new Set(newData)]
              }
            }
          }
          // 删除后  禁用
          this.isAddOrDel()
        } else {
          this.$message.error('请先选择您要删除的数据！')
        }
      }
      if (this.dataForm.templateCode == 't002') {
        if (this.knDelData.length) {
          for (let i = 0; i < this.knDelData.length; i++) {
            const row = this.knDelData[i];
            const index = this.dataFormTwo.data.indexOf(row);
            if (index > -1) {
              this.dataFormTwo.data.splice(index, 1); // 从tableData中删除选中的行
              // 在每一组后面添加空行
              let newData = [];
              let prevTorrNo = null;
              this.dataFormTwo.data = this.dataFormTwo.data.filter(item => !item.isShow)
              if (this.dataFormTwo.data.length) {
                this.dataFormTwo.data.forEach(item => {
                  if (prevTorrNo !== null && item.torrNo !== prevTorrNo) {
                    newData.push({
                      isShow: true,
                      torrNo: '',
                      packingMark: '',
                      productDrawingNo: '',
                      workOrderNo: '',
                      itemNumber: '',
                      customerProductNo: '',
                      mainUnit: '',
                      num: '',
                      pressure: '',
                      contractNo: '',
                      ask: '',
                      op2: '',
                      vehicleGroup: '',
                      ordersLineRemark2: '',
                      disabled: true
                    });
                  }
                  newData.push(item);
                  prevTorrNo = item.torrNo;
                });
                this.dataFormTwo.data = [...new Set(newData)]
              }
            }
          }
          // 删除后  禁用
          this.isAddOrDel()
        } else {
          this.$message.error('请先选择您要删除的数据！')
        }
      }
    },
    // 添加删除后 是否禁用列表选择按钮
    isAddOrDel() {
      if (this.dataFormTwo.data.length) {
        this.dataFormOne.data.forEach(item1 => {
          item1.disabled = false
          const index = this.dataFormTwo.data.findIndex(item2 => (item2.ordersLineId === item1.ordersLineId));
          if (index !== -1) {
            item1.disabled = true
          }
        });
      } else {
        this.dataFormOne.data.forEach(item1 => {
          item1.disabled = false
        });
      }
    },

    goBack() {
      this.$emit('close')
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.dataForm.id) {
        this.formLoading = true
        packPlabDetail(this.dataForm.id).then(res => {
          this.formLoading = false
          this.dataForm = res.data.packPlan
          this.dataFormTwoSale.data = res.data.packOrderList
          this.ordersIdLineArr = this.dataFormTwoSale.data.map(item => item.ordersId)
          this.templateVal = this.dataForm.templateCode
          // 明细数据
          this.dataFormTwo.data = res.data.packLineList.map(item => {
            return {
              ...item,
              disabled: !item.torrNo ? true : false,
              isShow: !item.torrNo ? true : false,
              vehicleGroup: item.vehicleGroup,
              op2: item.vehicleOp2,
            }
          })
          // 在每一组后面添加空行
          let newData = [];
          let prevTorrNo = null;
          this.dataFormTwo.data = this.dataFormTwo.data.filter(item => !item.isShow)
          if (this.dataFormTwo.data.length) {
            this.dataFormTwo.data.forEach(item => {
              if (prevTorrNo !== null && item.torrNo !== prevTorrNo) {
                newData.push({
                  isShow: true,
                  torrNo: '',
                  packingMark: '',
                  productDrawingNo: '',
                  workOrderNo: '',
                  itemNumber: '',
                  customerProductNo: '',
                  mainUnit: '',
                  num: '',
                  pressure: '',
                  contractNo: '',
                  ask: '',
                  op2: '',
                  vehicleGroup: '',
                  ordersLineRemark2: '',
                  disabled: true
                });
              }
              newData.push(item);
              prevTorrNo = item.torrNo;
            });
            this.dataFormTwo.data = [...new Set(newData)]
            this.linesQuery.torrNo = this.dataFormTwo.data[this.dataFormTwo.data.length - 1].torrNo
          }
          this.saleLineData(this.ordersIdLineArr)
          this.switchStyle()

        }).catch(error => {
          this.formLoading = false
        })
      } else {
      }
    },
    goBack() {
      this.$emit('close')
    },
    async handleConfirm(value) {
      this.btnLoading = true
      let submitFlag = true
      if (!this.dataFormTwoSale.data.length) {
        submitFlag = false
        this.btnLoading = false
        this.$message.error('请至少选择一项销售订单！')
        return
      }
      if (!this.dataFormTwo.data.length) {
        submitFlag = false
        this.btnLoading = false
        this.$message.error('请至少添加一项包装计划！')
        return
      }
      if (this.dataFormTwo.data.length) {
        let allExist = this.dataFormTwo.data.filter(item=>!item.isShow).every(item=>item.packingMark)
        let allEmpty = this.dataFormTwo.data.filter(item=>!item.isShow).every(item=>!item.packingMark)
        if (allExist) {
        } else if (allEmpty) {
        } else {
          submitFlag = false
          this.btnLoading = false
          this.$message.error('装箱标识不能部分为空，只能是全部为空或全部必填！')
          return
        }
      }
      let form_2 = this.$refs['dataFormTwo']
      let valid_2 = await form_2.validate().catch(err => false)
      if (!valid_2 && submitFlag) {
        submitFlag = false
        this.btnLoading = false
        this.jnpf.focusErrValidItem(form_2.fields)
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (submitFlag) {
            let packLineList = []
            this.dataFormTwo.data = this.dataFormTwo.data.filter(item => !item.isShow)
            this.dataFormTwo.data.forEach(item => {
              if (this.btnType == 'add') {
                packLineList.push({
                  vehicleGroup: item.vehicleGroup ? item.vehicleGroup : '',
                  op2: item.vehicleOp2 ? item.vehicleOp2 : '',
                  ordersLineId: item.ordersLineId,
                  pressure: item.pressure ? item.pressure : '',
                  torrNo: item.torrNo ? item.torrNo : '',
                  packingMark: item.packingMark ? item.packingMark : '',
                })
              } else {
                packLineList = this.dataFormTwo.data.map(item => {
                  return {
                    ...item,
                    id: item.id ? item.id : '',
                    ordersLineId: item.ordersLineId ? item.ordersLineId : '',
                    packPlanId: item.packPlanId ? item.packPlanId : '',
                  }
                })
              }
            })
            let _data = {
              packLineList,
              packPlan: this.dataForm,
              packPlanOrder: this.dataFormTwoSale.data
            }
            let formMethod = null;
            formMethod = this.btnType == 'edit' ? updatePackplan : addPackplan
            formMethod(_data).then(res => {
              let msg = formMethod == updatePackplan ? "修改成功" : "新建成功"
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
        } else {
          this.btnLoading = false
        }
      })

    },
    switchStyleheight() {
      const mainRegion = this.$refs.orderInfos.$parent.$parent.$el // 表单页面区域
      const mainRegion1 = this.$refs.main // 表单页面区域
      const mainHeight = mainRegion.clientHeight;
      const mainHeight1 = mainRegion1.clientHeight;
      // 其他同级组件占用高度
      let bortherHeight = 0
      const bortherItems = mainRegion1.querySelectorAll('.orderInfo > *')
      bortherItems.forEach(item => {
        if (item.className !== 'el-form data-form') bortherHeight += item.clientHeight
      })

      // 表格高度 = 区域总高度 - 同级元素高度 - 安全高度
      let maxHeight2 = mainHeight1 - bortherHeight - 112
      let maxHeight = mainHeight1 - 300 - 20
      this.customStyleData = maxHeight
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyleheight()
        }, 100);
      };
    },
    switchStyle() {
      // if (this.btnType !== 'look') return
      this.boxwidth = this.$refs.box.offsetWidth
      if (this.btnType !== 'look') {
        this.tableWidth = this.boxwidth / 2 - 100
        this.btnWidth = 100
      } else {
        this.tableWidth = this.boxwidth / 2
        this.btnWidth = 0
      }
      this.tableWidth2 = this.boxwidth - this.tableWidth - this.btnWidth - 30 > 0 ? this.boxwidth - this.tableWidth - this.btnWidth - 30 : 0
      window.onresize = () => {
        clearTimeout(this.width1out)
        this.width1out = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    handleResize(left, top, width, height) {
      this.tableWidth = width
      if (this.btnType !== 'look') {
        this.tableWidth = this.boxwidth / 2 - 100
        this.btnWidth = 100
      } else {
        this.tableWidth = this.boxwidth / 2
        this.btnWidth = 0
      }
      this.tableWidth2 = this.boxwidth - width - this.btnWidth - 30 > 0 ? this.boxwidth - this.btnWidth - width - 30 : 0
      this.btnWidth = 100
    },
    // 改变装箱标识 同组号的跟随改变
    changeMark(scope){
      let index = scope.$index
      let item = scope.row
      this.updatePackingMarkByTorrNo(item.torrNo,item.packingMark)
    },
    // 获取指定torrNo的所有数据
    getDataByTorrNo(torrNo) {
      return this.dataFormTwo.data.filter(data => data.torrNo === torrNo);
    },

    // 更新指定torrNo的packingMark值
    updatePackingMarkByTorrNo(torrNo, newPackingMark) {
      this.dataFormTwo.data.forEach(item=>{
        if (item.torrNo === torrNo) {
          item.packingMark = newPackingMark
        }
      })
    },
    // 行点击
    handleRowClick(row, column, event){
      if (!row.disabled){
        this.$refs.dataTableOne.toggleRowSelection(row)
      }
    },
    // 右边 行点击
    handleRowClick2(row, column, event){
      if (!row.disabled){
        this.$refs.dataTableTwo.toggleRowSelection(row)
      }
    },
    // 科尼行点击
    handleRowClick002(row, column, event){
      if (!row.disabled){
        this.$refs.dataTableOne.toggleRowSelection(row)
      }
    },
    // 右边 行点击
    handleRowClick003(row, column, event){
      if (!row.disabled){
        this.$refs.dataFormKn.toggleRowSelection(row)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: calc(100% - 49px) !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
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

::v-deep .el-tabs__item {
  border-bottom: 1px solid #DCDFE6;
}

::v-deep.el-tabs__header {
  padding-left: 0 !important;
}

.add {
  background: #f5f7fa;
  padding-left: 10px;
  border-bottom: 1px solid #ccc;
}

::v-deep .el-tabs--left .el-tabs__header.is-left {
  padding-left: 0 !important;
}

.lineTable {
  /* width: 100%; */
  display: flex;
  /* justify-content: space-around; */
  /* padding: 10px 10px 0 10px; */
  box-sizing: border-box;
}

/* .lineTable .left,
.lineTable .right {
  width: 47%;
} */

.lineCenter {
  width: 6%;
  margin: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lineCenter>button {
  width: 90%;
  margin: 0 !important;
  margin-top: 5% !important;
}

.nolineTable {
  display: flex;
  box-sizing: border-box;
}

.nolineTable .left,
.nolineTable .right {
  width: 49%;
  box-sizing: border-box;
}

/* ::v-deep .el-button+.el-button {
  margin: 0 !important;
  margin-top: 5% !important;
} */

::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}

.torrNo {
  display: flex;
  justify-content: center;
  align-items: center;
}

::v-deep .el-dialog {
  border-radius: 4px;
  margin: 0 !important;
}

::v-deep .el-dialog .el-dialog__header {
  border-bottom: 1px solid #dcdfe6 !important;
  padding: 0 20px !important;
  height: 56px !important;
  line-height: 56px !important;
}

::v-deep .el-dialog--center .el-dialog__body {
  padding: 0px 25px 30px !important;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px !important;
}

::v-deep .el-tabs {
  overflow: auto !important;
}

/* ::v-deep .el-table__fixed {
  height: calc(100% - 16px) !important;
} */

::v-deep .handle-mr {
  display: block !important;
}

::v-deep .dragging1 {
  transform: translate(0px, 0px) !important;
}

::v-deep .dragging2 {
  width: 100% !important;
}

::v-deep .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #e6a23c !important;
}
</style>