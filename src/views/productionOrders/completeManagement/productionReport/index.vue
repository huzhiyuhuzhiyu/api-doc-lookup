<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="生产订单" name="productionOrder">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm1.orderNo"
                      @keydown.enter.native="search1()"
                      placeholder="请输入订单号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm1.productName"
                      @keydown.enter.native="search1()"
                      placeholder="请输入产品名称"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm1.workOrderNo"
                      @keydown.enter.native="search1()"
                      placeholder="请输入工作令号"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-search"
                      @click="search1()"
                    >
                      {{ $t("common.search") }}</el-button
                    >
                    <el-button
                      size="mini"
                      icon="el-icon-refresh-right"
                      @click="reset1()"
                      >{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table
                ref="dataTable"
                v-loading="listLoading"
                :data="productionOrderList"
                :fixedNO="true"
                :key="1"
                custom-column
              >
                <el-table-column
                  prop="orderNo"
                  label="订单号"
                  min-width="180"
                  fixed="left"
                  :key="2"
                />
                <el-table-column
                  prop="productCode"
                  label="产品编码"
                  fixed="left"
                  min-width="140"
                  :key="3"
                />
                <el-table-column
                  prop="productName"
                  label="产品名称"
                  fixed="left"
                  min-width="160"
                  :key="4"
                />
                <el-table-column
                  prop="productDrawingNo"
                  label="产品图号"
                  width="160"
                  :key="5"
                />
                <el-table-column
                  prop="orderType"
                  label="订单类型"
                  width="120"
                  :key="6"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.orderType == 'normal'">正常订单</div>
                    <div v-if="scope.row.orderType == 'rework'">返工订单</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="planStartDate" label="计划开始日期" width="120" :key="7" /> -->
                <!-- <el-table-column prop="planEndDate" label="计划结束日期" width="120" :key="8" /> -->
                <el-table-column
                  prop="productionQuantity"
                  label="生产数量"
                  width="120"
                  :key="9"
                />
                <el-table-column
                  prop="completedQuantity"
                  label="已完成数量"
                  width="120"
                  :key="10"
                />
                <el-table-column
                  prop="mainUnit"
                  label="单位"
                  width="120"
                  :key="11"
                />
                <!-- <el-table-column prop="workOrderNo" label="工作令号" width="160" :key="12" /> -->
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                  min-width="200"
                  :key="13"
                />
                <el-table-column
                  label="操作"
                  width="140"
                  fixed="right"
                  :key="14"
                >
                  <template slot-scope="scope">
                    <el-button
                    :disabled="scope.row.blankingQuantity=='0'&&scope.row.dispatchedQuantity=='0'"
                      size="mini"
                      type="text"
                      @click="reportWork1(scope.row)"
                      >报工</el-button
                    >
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination
                :total="total1"
                :page.sync="orderForm1.pageNum"
                :limit.sync="orderForm1.pageSize"
                @pagination="initData1"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="生产工单" name="productionWorkOrder">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm2.orderNo"
                      @keydown.enter.native="search2()"
                      placeholder="请输入工单号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm2.productName"
                      @keydown.enter.native="search2()"
                      placeholder="请输入产品名称"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm2.workOrderNo"
                      @keydown.enter.native="search2()"
                      placeholder="请输入工作令号"
                      clearable
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-search"
                      @click="search2()"
                    >
                      {{ $t("common.search") }}</el-button
                    >
                    <el-button
                      size="mini"
                      icon="el-icon-refresh-right"
                      @click="reset2()"
                      >{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table
                ref="detailTable"
                v-loading="listLoading"
                :data="productionWorkOrderList"
                :fixedNO="true"
                :key="2"
                custom-column
              >
                <el-table-column
                  prop="orderNo"
                  label="工单号"
                  width="180"
                  fixed="left"
                  :key="15"
                />
                <el-table-column
                  prop="productName"
                  label="产品名称"
                  fixed="left"
                  width="160"
                  :key="16"
                />
                <el-table-column
                  prop="productDrawingNo"
                  label="产品图号"
                  fixed="left"
                  width="160"
                  :key="17"
                />
                <el-table-column
                  prop="processCode"
                  label="工序编码"
                  fixed="left"
                  width="160"
                  :key="18"
                />
                <el-table-column
                  prop="processName"
                  label="工序名称"
                  width="150"
                  :key="19"
                >
                </el-table-column>
                <el-table-column
                  prop="productionOrderNo"
                  label="生产订单号"
                  width="200"
                  :key="20"
                />
                <!-- <el-table-column prop="workOrderNo" label="工作令号" width="120" :key="21" /> -->
                <el-table-column
                  prop="workOrderQuantity"
                  label="订单生产数量"
                  width="120"
                  :key="22"
                />
                <el-table-column
                  prop="mainUnit"
                  label="单位"
                  width="120"
                  :key="23"
                />
                <el-table-column
                  prop="dispatchedQuantity"
                  label="已派工数量"
                  width="120"
                  :key="24"
                />
                <el-table-column
                  prop="completedQuantity"
                  label="完成数量"
                  width="200"
                  :key="25"
                />
                <!-- <el-table-column prop="planStartDate" label="计划开始日期" width="160" :key="26" /> -->
                <!-- <el-table-column prop="planEndDate" label="计划结束日期" width="160" :key="27" /> -->

                <el-table-column
                  prop="utilizationQuantity"
                  label="是否首道工序"
                  width="200"
                  :key="28"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.firstFlag">是</div>
                    <div v-if="!scope.row.firstFlag">否</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="productionQuantity"
                  label="是否报工"
                  width="200"
                  :key="29"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.reportFlag">是</div>
                    <div v-if="!scope.row.reportFlag">否</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="purchaseQuantity"
                  label="是否首末道工序"
                  width="200"
                  :key="30"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.lastFlag">是</div>
                    <div v-if="!scope.row.lastFlag">否</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="orderType"
                  label="工单类型"
                  width="200"
                  :key="31"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.orderType == 'normal'">正常工单</div>
                    <div v-if="scope.row.orderType == 'rework'">返工工单</div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                  width="180"
                  :key="32"
                />

                <el-table-column
                  label="操作"
                  width="140"
                  fixed="right"
                  :key="33"
                >
                  <template slot-scope="scope">
                    <el-button
                    :disabled="scope.row.dispatchedQuantity=='0'"
                      size="mini"
                      type="text"
                      @click="reportWork2(scope.row)"
                      >报工</el-button
                    >
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination
                :total="total2"
                :page.sync="orderForm2.pageNum"
                :limit.sync="orderForm2.pageSize"
                @pagination="initData2"
              />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="生产派工单" name="productionDispatchWorkOrder">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm3.orderNo"
                      @keydown.enter.native="search3()"
                      placeholder="请输入派工单号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm3.productionOrderNo"
                      @keydown.enter.native="search3()"
                      placeholder="请输入生产订单号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input
                      v-model="orderForm3.workNo"
                      @keydown.enter.native="search3()"
                      placeholder="请输入工单单号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button
                      type="primary"
                      size="mini"
                      icon="el-icon-search"
                      @click="search3()"
                    >
                      {{ $t("common.search") }}</el-button
                    >
                    <el-button
                      size="mini"
                      icon="el-icon-refresh-right"
                      @click="reset3()"
                      >{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button
                    style="margin-left: 10px"
                    size="mini"
                    @click="batchWork"
                    type="primary"
                    >批量报工</el-button
                  >
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip
                    effect="dark"
                    :content="$t('common.refresh')"
                    placement="top"
                  >
                    <el-link
                      icon="icon-ym icon-ym-Refresh JNPF-common-head-icon"
                      :underline="false"
                      @click="initData3()"
                    />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table
                ref="detailTables"
                v-loading="listLoading"
                :data="productionDispatchWorkOrderList"
                :key="99"
                :fixedNO="true"
                custom-column
                @selection-change="selectworkstation"
                hasC
              >
                <el-table-column
                  prop="orderNo"
                  label="派工单号"
                  width="180"
                  fixed="left"
                  :key="34"
                />
                <el-table-column
                  prop="productionOrderNo"
                  label="生产订单号"
                  fixed="left"
                  width="200"
                  :key="35"
                />
                <!-- <el-table-column prop="workOrderNo" label="工作令号" fixed="left" width="160" :key="36" /> -->
                <el-table-column
                  prop="workNo"
                  label="工单单号"
                  fixed="left"
                  width="180"
                  :key="37"
                />
                <el-table-column
                  prop="workGroupName"
                  label="班组名称"
                  width="150"
                  :key="38"
                >
                </el-table-column>
                <el-table-column
                  prop="equipmentName"
                  label="设备名称"
                  width="160"
                  :key="39"
                />
                <el-table-column
                  prop="personName"
                  label="人员名称"
                  width="120"
                  :key="40"
                />
                <el-table-column
                  prop="productionLineName"
                  label="产线名称"
                  width="120"
                  :key="41"
                />
                <el-table-column
                  prop="workstationName"
                  label="工位名称"
                  width="120"
                  :key="42"
                />
                <el-table-column
                  prop="dispatchQuantity"
                  label="派工生产数量"
                  width="200"
                  :key="43"
                />
                <el-table-column
                  prop="completedQuantity"
                  label="完成数"
                  width="120"
                  :key="44"
                />
                <el-table-column
                  prop="planStartDate"
                  label="计划开始时间"
                  width="200"
                  :key="45"
                />
                <el-table-column
                  prop="planEndDate"
                  label="计划结束时间"
                  width="200"
                  :key="46"
                />
                <el-table-column
                  prop="actualStartDate"
                  label="实际开始时间"
                  width="200"
                  :key="47"
                />
                <el-table-column
                  prop="actualEndDate"
                  label="实际结束时间"
                  width="200"
                  :key="48"
                />
                <el-table-column
                  prop="processCode"
                  label="工序编码"
                  width="160"
                  :key="49"
                />
                <el-table-column
                  prop="processName"
                  label="工序名称"
                  width="160"
                  :key="50"
                />
                <!-- <el-table-column prop="workOrderStatus" label="派工单状态" width="160" :key="51">
                  <template slot-scope="scope">
                    <div v-if="scope.row.workOrderStatus == 'normal'">正常</div>
                    <div v-if="scope.row.workOrderStatus == 'suspend'">暂停</div>
                    <div v-if="scope.row.workOrderStatus == 'close '">关闭</div>
                    <div v-if="scope.row.workOrderStatus == 'finish '">已完成</div>
                  </template>
                </el-table-column> -->
                <el-table-column
                  prop="remark"
                  label="备注"
                  width="160"
                  :key="52"
                />

                <el-table-column
                  prop="createTime"
                  label="创建时间"
                  width="180"
                  :key="53"
                />
              </JNPF-table>
              <pagination
                :total="total3"
                :page.sync="orderForm3.pageNum"
                :limit.sync="orderForm3.pageSize"
                @pagination="initData3"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="报工信息"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      lock-scroll
      class="JNPF-dialog JNPF-dialog_center"
      width="1000px"
      :key="2"
    >
      <el-row :gutter="20">
        <el-form
          :model="dataFormTwo"
          v-bind="dataFormTwo"
          ref="productForm"
          class="data-form"
        >
          <JNPF-table
            ref="workerDialog"
            v-loading="listLoading"
            :data="dataFormTwo.workerList"
            style="height: 40vh"
            :key="666"
          >
            <el-table-column
              prop="productionOrderNo"
              label="生产订单号"
              :show-overflow-tooltip="true"
              width="200"
            >
            </el-table-column>
            <el-table-column
              prop="workNo"
              label="工单号"
              :show-overflow-tooltip="true"
              width="180"
            />
            <el-table-column
              prop="orderNo"
              label="派工单号"
              :show-overflow-tooltip="true"
              min-width="200"
            ></el-table-column>
            <el-table-column
              prop="processCode"
              label="工序编码"
              min-width="200"
            >
            </el-table-column>
            <el-table-column
              prop="processName"
              label="工序名称"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="workGroupName"
              label="班组名称"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="equipmentName"
              label="设备名称"
              :show-overflow-tooltip="true"
              width="170"
            >
            </el-table-column>
            <el-table-column prop="personName" label="人员名称" width="160">
            </el-table-column>
            <el-table-column
              prop="dispatchQuantity"
              label="派工生产数量"
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="completedQuantity"
              label="已完工数量"
              width="160"
            >

            </el-table-column>
            <el-table-column prop="industrialWasteQuantity" label="已报工废数量" min-width="130" />
          <el-table-column prop="equipmentProductionQuantity" label="设备采集量" width="160">
            <template slot-scope="scope">
              <div>{{scope.row.businessCode=="metalworking"?scope.row.equipmentProductionQuantity:"-"}}</div>
            </template>

             </el-table-column>

            <el-table-column
              prop="reportingQuantity"
              label="报工数量"
              width="170"
            >
              <template slot="header"
                ><span class="required">*</span>报工数量</template
              >
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'workerList.' + scope.$index + '.' + 'reportingQuantity'
                  "
                  :rules="workerList.reportingQuantity"
                >
                  <el-input
                    v-model="scope.row.reportingQuantity"
                    placeholder="请输入报工数量"
                    maxlength="11"
                    style="width: 145px"
                  >
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="industrialWasteQuantity"
              label="工废数量"
              width="170"
            >
              <template slot="header"
                ><span class="required">*</span>工废数量</template
              >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.industrialWasteQuantity"
                  @input="allNumberindustrial(scope)"
                  placeholder="请输入工废数量"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="materialWasteQuantity"
              label="料废数量"
              width="170"
            >
              <template slot="header"
                ><span class="required">*</span>料废数量</template
              >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.materialWasteQuantity"
                  @input="allNumbermaterial(scope)"
                  placeholder="请输入料废数量"
                />
              </template>
            </el-table-column>

            <el-table-column prop="producerId" label="生产人" width="170">
              <template slot="header">
                <span class="required">*</span>生产人
              </template>
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.producerId"
                  placeholder="请选择生产人"
                  :disabled="scope.row.selectPersonFlag"
                >
                  <el-option
                    v-for="(item, index) in scope.row.personList"
                    :key="index"
                    :label="item.producerName"
                    :value="item.producerId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120"
              fixed="right"
              v-if="activeName != 'productionWorkOrder'"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  :disabled="dataFormTwo.workerList.length == 1"
                  @click="handleDel(scope)"
                  style="color: #ff3a3a"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </JNPF-table>
        </el-form>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="reportWork()"
          size="mini"
        >
          确认</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 生产订单列表
import { getprodOrderList } from "@/api/productOrdes/finishedProductOrders";
// 派工单列表
import { getDispatchList } from "@/api/productOrdes/dispatchTicketInquiry";
// 工单列表
import { getWorkList, addWorkReport } from "@/api/productOrdes/index";

import { getquEquipmentPerson, getGroupDataInfo } from "@/api/basicData/index";
export default {
  data() {
    return {
      workerList: {
        reportingQuantity: [
          { required: true, trigger: "blur", message: "请填写报工数量" },
          {
            validator: this.formValidate({
              type: "decimal",
              params: [
                20,
                4,
                false,
                (errMsg) => {
                  this.$message.error(`报工数量：${errMsg}`);
                },
              ],
            }),
            trigger: "blur",
          },
        ],
      },
      dataFormTwo: {
        workerList: [],
      },
      btnLoading: false,
      personList: [],
      total1: 0,
      total2: 0,
      total3: 0,
      productionOrderList: [],
      productionWorkOrderList: [],
      productionDispatchWorkOrderList: [],
      // 生产订单列表查询条件
      orderForm1: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        orderNo: "",
        workOrderNo: "",
        productName: "",
        demandType: "",
        orderStatus: "normal",
        businessCode:"complete",
      },
      // 工单列表查询条件
      orderForm2: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        orderNo: "",
        workOrderNo: "",
        productName: "",
        processingType: "self_produced",
        demandType: "",
        prodOrderStatus: "normal",
        reportFlag: 1,
        businessCode:"complete",
      },
      // 派工单列表查询条件
      orderForm3: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        productionOrderNo: "",
        workNo: "",
        orderNo: "",
        demandType: "",
        workReportFlag: 1,
        workOrderStatus: "normal",
        businessCode:"complete",
      },
      selectPersonFlag: false,
      visible: false,

      listLoading: false,
      activeName: "productionOrder",
      salespersonList: [],
      flag: true,
      detailFlag: false,
      orderList: [
        { label: "正常订单", value: "normal" },
        { label: "预测订单", value: "prediction" },
        { label: "样品订单", value: "sample" },
        { label: "备货订单", value: "stock_up" },
        { label: "急件订单", value: "urgent" },
      ],

      detailForm: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.initData1();
    console.log("userInfo", this.userInfo);

    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
    // scope.row.reportingQuantity scope.row.industrialWasteQuantity scope.row.materialWasteQuantity

    allNumberindustrial(scope) {
      this.dataFormTwo.workerList[scope.$index].industrialWasteQuantity =
        scope.row.industrialWasteQuantity.replace(/[^\d]/g, ""); //只能输入数字
    },
    allNumbermaterial(scope) {
      this.dataFormTwo.workerList[scope.$index].materialWasteQuantity =
        scope.row.materialWasteQuantity.replace(/[^\d]/g, ""); //只能输入数字
    },
    handleDel(row) {
      console.log(row.$index);
      //
      this.dataFormTwo.workerList.splice(row.$index, 1);
    },
    // 提交报工的数据
    reportWork() {
      let flag = null;
      if (this.dataFormTwo.workerList.length > 0) {
        for (
          let index = 0;
          index < this.dataFormTwo.workerList.length;
          index++
        ) {
          const item = this.dataFormTwo.workerList[index];
          if (!Number(item.reportingQuantity)) {
            flag = false;
            this.$message({
              message: "第" + (index + 1) + "行报工数量不能 为空或者为0",
              type: "error",
            });
            break;
          }
          console.log(
            "666",
            item.industrialWasteQuantity,
            item.materialWasteQuantity
          );
          if (item.industrialWasteQuantity === "") {
            flag = false;
            this.$message({
              message: "第" + (index + 1) + "行工废数量不能为空",
              type: "error",
            });
            break;
          }
          if (item.materialWasteQuantity === "") {
            flag = false;
            this.$message({
              message: "第" + (index + 1) + "行料废数量不能为空",
              type: "error",
            });
            break;
          }
          if (
            Number(item.reportingQuantity) + Number(item.completedQuantity) >
            Number(item.dispatchQuantity)
          ) {
            flag = false;
            this.$message({
              message:
                "第" +
                (index + 1) +
                "行已完工数量加上报工数量不得超过派工生产数量",
              type: "error",
            });
            break;
          }
          if (item.personId && !item.producerId) {
            flag = false;
            this.$message({
              message: "第" + (index + 1) + "行生产人员不能为空",
              type: "error",
            });
            break;
          } else if (item.equipmentId && !item.producerId) {
            flag = false;
            this.$message({
              message: "第" + (index + 1) + "行生产人员不能为空",
              type: "error",
            });
            break;
          } else if (item.workGroupId) {
            // reportingType 报工类型：按工序和人报工by_process、按工序总数报工by_total
            // workType 做工类型(做同道工序same、做不同工序different)
            // 如果班组的做工类型为同道工序  报工类型为按工序和人报工 或者做不同工序的需要选择人员
            // 如果是做通道工序且报工类型为按总工序报工的不需要选择人员
            if (item.workType == "same") {
              if (item.reportingType == "by_process" && !item.producerId) {
                flag = false;
                this.$message({
                  message: "第" + (index + 1) + "行生产人员不能为空",
                  type: "error",
                });
                break;
              }
            }
            if (item.workType == "different" && !item.producerId) {
              flag = false;
              this.$message({
                message: "第" + (index + 1) + "行生产人员不能为空",
                type: "error",
              });
              break;
            }
          }
        }
      }
      if (flag === false) return;
      this.btnLoading = true;
      addWorkReport(this.dataFormTwo.workerList)
        .then((res) => {
          this.btnLoading = false;
          console.log("报工结果", res);
          this.visible = false;
          this.$message({
            message: "报工成功",
            type: "success",
          });
          if (this.activeName == "productionOrder") {
            this.initData1();
          } else if (this.activeName == "productionWorkOrder") {
            this.initData2();
          } else if (this.activeName == "productionDispatchWorkOrder") {
            this.initData3();
          }
        })
        .catch((eror) => {
          this.btnLoading = false;
        });
    },
    // 报工
    // 生产订单报工
    reportWork1(row) {
      console.log("生产订单", row);
      let obj = {
        demandType: "",
        productionOrderNo: row.orderNo,
        workOrderStatus: "normal",
        workReportFlag: true,
      };
      this.dataFormTwo.workerList = [];
      getDispatchList(obj).then((res) => {
        console.log("生产订单派工数据", res);
        if (res.data.records.length > 0) {
          this.visible = true;
          this.$nextTick(() => {
            this.$forceUpdate();
          });
          res.data.records.forEach((item, index) => {
            item.personList = [];
            item.producerId = item.personId;
            item.producerName = item.personName;
            item.selectPersonFlag = false;
            item.industrialWasteQuantity = "0";
            item.materialWasteQuantity = "0";
            if(item.businessCode=="metalworking"){
              item.reportingQuantity=item.equipmentProductionQuantity
            }else{
              item.reportingQuantity =
              item.dispatchQuantity - item.completedQuantity;
            }
           
            item.dispatchListId = item.id;
            // 判断人员是否可选
            if (item.personId) {
              if (item.routingProResMap.personnel.length > 0) {
                item.routingProResMap.personnel.forEach((ids) => {
                  let obj = {
                    producerId: ids.resourceId,
                    producerName: ids.resourceName,
                  };

                  item.producerId = ids.resourceId;
                  item.producerName = ids.resourceName;
                  if (item.personList.length > 0) {
                    const isContained = item.personList.some(
                      (item) => item.producerId === ids.resourceId
                    );

                    if (isContained) {
                    } else {
                      item.personList.push(obj);
                    }
                  } else {
                    item.personList.push(obj);
                  }
                });
              }
            }

            if (item.equipmentId) {
              let obj = {
                producerId: this.userInfo.userId,
                producerName: this.userInfo.userName,
              };
              item.producerId = this.userInfo.userId;
              item.producerName = this.userInfo.userName;
              if (item.personList.length > 0) {
                const isContained = item.personList.some(
                  (item) => item.producerId === this.userInfo.userId
                );

                if (isContained) {
                } else {
                  item.personList.push(obj);
                }
              } else {
                item.personList.push(obj);
              }
              // let tableQuery = {
              //   pageNum: 1,
              //   pageSize: -1,
              //   orderItems: [{
              //     asc: false,
              //     column: ""
              //   }, {
              //     asc: false,
              //     column: "createTime"
              //   }],
              //   code: item.equipmentCode,
              //   name: "",
              //   state: "enable",
              //   realName: ''

              // };
              // getquEquipmentPerson(tableQuery).then(response => {
              //   console.log("设备人员", response);
              //   if (response.data.records.length > 0) {
              //     response.data.records.forEach(ids => {
              //       let obj = {
              //         producerId: ids.personId,
              //         producerName: ids.realName,
              //       }
              //       item.personList.push(obj)
              //     });
              //   }
              // })
            }
            if (item.workGroupId) {
              // reportingType 报工类型：按工序和人报工by_process、按工序总数报工by_total
              // workType 做工类型(做同道工序same、做不同工序different)
              // 如果班组的做工类型为同道工序  报工类型为按工序和人报工 或者做不同工序的需要选择人员
              // 如果是做通道工序且报工类型为按总工序报工的不需要选择人员
              if (item.workType == "same") {
                if (item.reportingType == "by_process") {
                  getGroupDataInfo(item.workGroupId).then((response) => {
                    console.log("获取班组人员1", response);
                    if (response.data.returnLines.length > 0) {
                      console.log(1);
                      response.data.returnLines.forEach((items) => {
                        console.log(2);
                        let obj = {
                          producerId: items.personnelId,
                          producerName: items.personnelIdText,
                        };

                        item.producerId = items.personnelId;
                        item.producerName = items.personnelIdText;
                        if (item.personList.length > 0) {
                          const isContained = item.personList.some(
                            (item) => item.producerId === items.personnelId
                          );

                          if (isContained) {
                          } else {
                            item.personList.push(obj);
                          }
                        } else {
                          item.personList.push(obj);
                        }
                      });
                    }
                  });
                } else if (item.reportingType == "by_total") {
                  item.selectPersonFlag = true;
                }
              } else if (item.workType == "different") {
                getGroupDataInfo(item.workGroupId).then((response) => {
                  console.log("获取班组人员2", response);
                  if (response.data.returnLines.length > 0) {
                    response.data.returnLines.forEach((items) => {
                      let obj = {
                        producerId: items.personnelId,
                        producerName: items.personnelIdText,
                      };

                      item.producerId = items.personnelId;
                      item.producerName = items.personnelIdText;
                      if (item.personList.length > 0) {
                        const isContained = item.personList.some(
                          (item) => item.producerId === items.personnelId
                        );

                        if (isContained) {
                        } else {
                          item.personList.push(obj);
                        }
                      } else {
                        item.personList.push(obj);
                      }
                    });
                  }
                });
              }
              console.log((item, 333333));
            }

            console.log("item++++>", item);
          });
          let uniqueArr = [];
          // res.data.records.forEach(item => {
          //   console.log(999, item.personList);
          //    uniqueArr = item.personList.reduce((acc, current) => {
          //     const x = acc.find(item => item.producerId === current.producerId);
          //     console.log("x",x);
          //     if (!x) {
          //       return acc.concat([current]);
          //     } else {
          //       return acc;
          //     }
          //   }, []);
          // });

          this.dataFormTwo.workerList = res.data.records;
        } else {
          this.$message({
            message: "暂无可报工数据",
            type: "error",
          });
        }
      });
    },
    reportWork2(row) {
      console.log("生产工单", row);
      let obj = {
        demandType: "",
        workNo: row.orderNo,
        workOrderStatus: "normal",
        workReportFlag: 1,
      };
      this.dataFormTwo.workerList = [];

      getDispatchList(obj).then((res) => {
        if (res.data.records.length > 0) {
          this.visible = true;

          res.data.records.forEach((item) => {
            item.personList = [];
            item.producerId = item.personId;
            item.producerName = item.personName;
            item.selectPersonFlag = false;
            item.industrialWasteQuantity = "0";
            item.materialWasteQuantity = "0";
            if(item.businessCode=="metalworking"){
              item.reportingQuantity=item.equipmentProductionQuantity
            }else{
              item.reportingQuantity = item.dispatchQuantity - item.completedQuantity;
            }
           
            item.dispatchListId = item.id;
            // 判断人员是否可选
            if (item.personId) {
              if (item.routingProResMap.personnel.length > 0) {
                item.routingProResMap.personnel.forEach((ids) => {
                  let obj = {
                    producerId: ids.resourceId,
                    producerName: ids.resourceName,
                  };

                  item.producerId = ids.resourceId;
                  item.producerName = ids.resourceName;
                  if (item.personList.length > 0) {
                    const isContained = item.personList.some(
                      (item) => item.producerId === ids.resourceId
                    );

                    if (isContained) {
                    } else {
                      item.personList.push(obj);
                    }
                  } else {
                    item.personList.push(obj);
                  }
                });
              }
            }
            if (item.equipmentId) {
              let obj = {
                producerId: this.userInfo.userId,
                producerName: this.userInfo.userName,
              };
              item.producerId = this.userInfo.userId;
              item.producerName = this.userInfo.userName;
              if (item.personList.length > 0) {
                const isContained = item.personList.some(
                  (item) => item.producerId === this.userInfo.userId
                );

                if (isContained) {
                } else {
                  item.personList.push(obj);
                }
              } else {
                item.personList.push(obj);
              }
              // let tableQuery = {
              //   pageNum: 1,
              //   pageSize: -1,
              //   orderItems: [{
              //     asc: false,
              //     column: ""
              //   }, {
              //     asc: false,
              //     column: "createTime"
              //   }],
              //   code: item.equipmentCode,
              //   name: "",
              //   state: "enable",
              //   realName: ''

              // };
              // getquEquipmentPerson(tableQuery).then(response => {
              //   console.log("设备人员", response);
              //   if (response.data.records.length > 0) {
              //     if (response.data.records.length == 1) {
              //       item.producerId = response.data.records[0].personId
              //       item.producerName = response.data.records[0].realName
              //       let obj = {
              //         producerId: response.data.records[0].personId,
              //         producerName: response.data.records[0].realName,
              //       }
              //       item.personList.push(obj)

              //     } else {
              //       response.data.records.forEach(ids => {
              //         let obj = {
              //           producerId: ids.personId,
              //           producerName: ids.realName,
              //         }
              //         item.personList.push(obj)
              //       });
              //     }

              //   }
              // })
            }
            if (item.workGroupId) {
              // reportingType 报工类型：按工序和人报工by_process、按工序总数报工by_total
              // workType 做工类型(做同道工序same、做不同工序different)
              // 如果班组的做工类型为同道工序  报工类型为按工序和人报工 或者做不同工序的需要选择人员
              // 如果是做通道工序且报工类型为按总工序报工的不需要选择人员
              if (item.workType == "same") {
                if (item.reportingType == "by_process") {
                  getGroupDataInfo(item.workGroupId).then((response) => {
                    console.log("获取班组人员1", response);
                    if (response.data.returnLines.length > 0) {
                      if (response.data.returnLines.length == 1) {
                        let obj = {
                          producerId: response.data.returnLines[0].personnelId,
                          producerName:
                            response.data.returnLines[0].personnelIdText,
                        };

                        item.producerId =
                          response.data.returnLines[0].personnelId;
                        item.producerName =
                          response.data.returnLines[0].personnelIdText;
                        if (item.personList.length > 0) {
                          const isContained = item.personList.some(
                            (item) =>
                              item.producerId ===
                              response.data.returnLines[0].personnelId
                          );

                          if (isContained) {
                          } else {
                            item.personList.push(obj);
                          }
                        } else {
                          item.personList.push(obj);
                        }
                      } else {
                        response.data.returnLines.forEach((ids) => {
                          let obj = {
                            producerId: ids.personnelId,
                            producerName: ids.personnelIdText,
                          };
                          item.producerId = ids.personnelId;
                          item.producerName = ids.personnelIdText;
                          if (item.personList.length > 0) {
                            const isContained = item.personList.some(
                              (item) => item.producerId === ids.personnelId
                            );

                            if (isContained) {
                            } else {
                              item.personList.push(obj);
                            }
                          } else {
                            item.personList.push(obj);
                          }
                        });
                      }

                      // console.log(1);
                      // response.data.returnLines.forEach(items => {
                      //   console.log(2);
                      //   let obj = {
                      //     producerId: items.personnelId,
                      //     producerName: items.personnelIdText,
                      //   }
                      //   item.personList.push(obj)
                      //   console.log("55555", item);
                      // });
                    }
                  });
                } else if (item.reportingType == "by_total") {
                  item.selectPersonFlag = true;
                }
              }
              if (item.workType == "different") {
                getGroupDataInfo(item.workGroupId).then((response) => {
                  console.log("获取班组人员2", response);
                  if (response.data.returnLines.length > 0) {
                    if (response.data.returnLines.length == 1) {
                      item.producerId =
                        response.data.returnLines[0].personnelId;
                      item.producerName =
                        response.data.returnLines[0].personnelIdText;
                      let obj = {
                        producerId: response.data.returnLines[0].personnelId,
                        producerName:
                          response.data.returnLines[0].personnelIdText,
                      };
                      if (item.personList.length > 0) {
                        const isContained = item.personList.some(
                          (item) =>
                            item.producerId ===
                            response.data.returnLines[0].personnelId
                        );

                        if (isContained) {
                        } else {
                          item.personList.push(obj);
                        }
                      } else {
                        item.personList.push(obj);
                      }
                    } else {
                      response.data.returnLines.forEach((ids) => {
                        let obj = {
                          producerId: ids.personnelId,
                          producerName: ids.personnelIdText,
                        };

                        item.producerId = ids.personnelId;
                        item.producerName = ids.personnelIdText;
                        if (item.personList.length > 0) {
                          const isContained = item.personList.some(
                            (item) => item.producerId === ids.personnelId
                          );

                          if (isContained) {
                          } else {
                            item.personList.push(obj);
                          }
                        } else {
                          item.personList.push(obj);
                        }
                      });
                    }
                    // response.data.returnLines.forEach(items => {
                    //   let obj = {
                    //     producerId: items.personnelId,
                    //     producerName: items.personnelIdText,
                    //   }
                    //   item.personList.push(obj)
                    // });
                  }
                });
              }
              console.log((item, 333333));
            }
          });
          let uniqueArr = Array.from(
            new Set(res.data.records.map((item) => item.producerId))
          ).map((producerId) => {
            return res.data.records.find(
              (item) => item.producerId === producerId
            );
          });
          this.dataFormTwo.workerList = uniqueArr;

          this.dataFormTwo.workerList.forEach((item) => {});
        } else {
          this.$message({
            message: "暂无可报工数据",
            type: "error",
          });
        }
        console.log("生产工单派工数据", res);
      });
    },
    batchWork() {
      console.log("生产派工单", this.dataFormTwo.workerList);
      if (this.dataFormTwo.workerList.length) {
        this.dataFormTwo.workerList.forEach((item, index) => {
          item.personList = [];
          item.producerId = item.personId;
          item.producerName = item.personName;
          item.selectPersonFlag = false;
          if(item.businessCode=="metalworking"){
              item.reportingQuantity=item.equipmentProductionQuantity
            }else{
              item.reportingQuantity =
              item.dispatchQuantity - item.completedQuantity;
            }
          item.dispatchListId = item.id;
          // 判断人员是否可选
          if (item.personId) {
            this.visible = true;
            if (item.routingProResMap.personnel.length > 0) {
              item.routingProResMap.personnel.forEach((ids) => {
                let obj = {
                  producerId: ids.resourceId,
                  producerName: ids.resourceName,
                };
                item.producerId = ids.resourceId;
                item.producerName = ids.resourceName;
                console.log("item,person4", item.personList);
                if (item.personList.length > 0) {
                  const isContained = item.personList.some(
                    (item) => item.producerId === ids.resourceId
                  );

                  if (isContained) {
                  } else {
                    item.personList.push(obj);
                  }
                } else {
                  item.personList.push(obj);
                }
              });
            }
          }
          if (item.equipmentId) {
            let obj = {
              producerId: this.userInfo.userId,
              producerName: this.userInfo.userName,
            };
            item.producerId = this.userInfo.userId;
            item.producerName = this.userInfo.userName;
            console.log("item,person3", item.personList);
            if (item.personList.length > 0) {
              const isContained = item.personList.some(
                (item) => item.producerId === this.userInfo.userId
              );

              if (isContained) {
              } else {
                item.personList.push(obj);
              }
            } else {
              item.personList.push(obj);
            }

            this.visible = true;
          }
          if (item.workGroupId) {
            // reportingType 报工类型：按工序和人报工by_process、按工序总数报工by_total
            // workType 做工类型(做同道工序same、做不同工序different)
            // 如果班组的做工类型为同道工序  报工类型为按工序和人报工 或者做不同工序的需要选择人员
            // 如果是做通道工序且报工类型为按总工序报工的不需要选择人员
            if (item.workType == "same") {
              if (item.reportingType == "by_process") {
                getGroupDataInfo(item.workGroupId).then((response) => {
                  this.visible = true;
                  console.log("获取班组人员1", response);
                  if (response.data.returnLines.length > 0) {
                    console.log(1);
                    response.data.returnLines.forEach((items) => {
                      console.log(2);
                      let obj = {
                        producerId: items.personnelId,
                        producerName: items.personnelIdText,
                      };
                      item.producerId = items.personnelId;
                      item.producerName = items.personnelIdText;
                      console.log("item,person2", item.personList);
                      if (item.personList.length > 0) {
                        const isContained = item.personList.some(
                          (item) => item.producerId === items.personnelId
                        );

                        if (isContained) {
                        } else {
                          item.personList.push(obj);
                        }
                      } else {
                        item.personList.push(obj);
                      }

                      console.log("55555", item);
                    });
                  }
                });
              } else if (item.reportingType == "by_total") {
                item.selectPersonFlag = true;
              }
            }

            if (item.workType == "different") {
              getGroupDataInfo(item.workGroupId).then((response) => {
                this.visible = true;
                console.log("获取班组人员2", response);
                if (response.data.returnLines.length > 0) {
                  console.log(123);
                  response.data.returnLines.forEach((items) => {
                    let obj = {
                      producerId: items.personnelId,
                      producerName: items.personnelIdText,
                    };
                    item.producerId = items.personnelId;
                    item.producerName = items.personnelIdText;
                    if (item.personList.length > 0) {
                      const isContained = item.personList.some(
                        (item) => item.producerId === items.personnelId
                      );

                      if (isContained) {
                      } else {
                        item.personList.push(obj);
                      }
                    } else {
                      item.personList.push(obj);
                    }
                  });
                }
              });
            }
          }
        });
      } else {
        this.$message({
          message: "请选择派工单数据",
          type: "error",
        });
      }
    },
    selectworkstation(val) {
      console.log(val);
      this.dataFormTwo.workerList = val;
      
    },
    // 切换table
    handleClick(e) {
      console.log("333333", e.name);
      this.activeName = e.name;

      if (e.name == "productionOrder") {
        this.initData1();
      } else if (e.name == "productionWorkOrder") {
        this.initData2();
      } else if (e.name == "productionDispatchWorkOrder") {
        this.initData3();
      }
    },

    search1() {
      Object.keys(this.orderForm1).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.orderForm1[key];
        this.orderForm1[key] = typeof item === "string" ? item.trim() : item;
      });
      this.orderForm1.pageNum = 1;
      this.initData1();
    },
    // 获取生产订单列表数据
    initData1() {
      getprodOrderList(this.orderForm1).then((res) => {
        console.log("生产订单列表数据", res);
        this.productionOrderList = res.data.records;
        this.total1 = res.data.total;
      });
    },
    reset1() {
      (this.orderForm1 = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        orderNo: "",
        workOrderNo: "",
        productName: "",
        demandType: "",
        orderStatus: "normal",
        businessCode:"complete",
      }),
        this.search1();
    },

    search2() {
      Object.keys(this.orderForm2).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.orderForm2[key];
        this.orderForm2[key] = typeof item === "string" ? item.trim() : item;
      });
      this.orderForm2.pageNum = 1;
      this.initData2();
    },
    initData2() {
      getWorkList(this.orderForm2).then((res) => {
        console.log("生产工单列表数据", res);
        this.productionWorkOrderList = res.data.records;
        this.total2 = res.data.total;
      });
    },
    reset2() {
      (this.orderForm2 = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        orderNo: "",
        workOrderNo: "",
        productName: "",
        processingType: "self_produced",
        demandType: "",
        receiveStatus: "received",
        prodOrderStatus: "normal",
        reportFlag: 1,
        businessCode:"complete",
      }),
        this.search2();
    },

    search3() {
      Object.keys(this.orderForm3).forEach((key) => {
        // 清除搜索条件两端空格
        let item = this.orderForm3[key];
        this.orderForm3[key] = typeof item === "string" ? item.trim() : item;
      });
      this.orderForm3.pageNum = 1;
      this.initData3();
    },
    initData3() {
      getDispatchList(this.orderForm3).then((res) => {
        console.log("生产派工单列表数据", res);
        res.data.records.forEach((item) => {
          item.industrialWasteQuantity = "0";
          item.materialWasteQuantity = "0";
          item.reportingQuantity =
            item.dispatchQuantity - item.completedQuantity;
        });
        this.productionDispatchWorkOrderList = res.data.records;
        this.total3 = res.data.total;
      });
    },
    reset3() {
      (this.orderForm3 = {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "create_time",
          },
        ],
        productionOrderNo: "",
        workNo: "",
        orderNo: "",
        demandType: "",
        workReportFlag: 1,
        workOrderStatus: "normal",
        businessCode:"complete",
      }),
        this.search3();
    },
  },
};
</script>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>
<style src="@/assets/scss/tabs-list.scss" lang="scss" scoped />