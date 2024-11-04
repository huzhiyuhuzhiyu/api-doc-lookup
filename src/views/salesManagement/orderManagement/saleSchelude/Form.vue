<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="'销售订单进度'" />
          <div class="options">
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading" ref="main">
          <el-collapse v-model="activeNames1" class="orderInfo">
            <el-collapse-item title="基本信息" name="basicInfo">
              <div class="stoclInfo" ref="stoclInfo">
                <el-descriptions :column="1" class="orderNo">
                  <el-descriptions-item label="订单号">{{ dataForm.orderNo }} </el-descriptions-item>
                </el-descriptions>

                <el-descriptions class="margin-top" :column="4">

                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'normal'">
                    <el-tag style="vertical-align: super;" effect="dark">正常订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'prediction'">
                    <el-tag style="vertical-align: super;" effect="dark" type="success">预测订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'sample'">
                    <el-tag style="vertical-align: super;" effect="dark" type="info">样品订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'stock_up'">
                    <el-tag style="vertical-align: super;" effect="dark" type="warning">备货订单</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="订单类型" class="orderNo" v-if="dataForm.orderType == 'urgent'">
                    <el-tag style="vertical-align: super;" effect="dark" type="danger">急件订单</el-tag>
                  </el-descriptions-item>

                  <el-descriptions-item label="所属客户" class="orderNo">{{ dataForm.cooperativePartnerName }}
                  </el-descriptions-item>
                  <el-descriptions-item label="所属部门" class="orderNo">{{ dataForm.departmentName
                    }}</el-descriptions-item>
                  <el-descriptions-item label="所属销售" class="orderNo">{{ dataForm.salesName }}</el-descriptions-item>
                  <el-descriptions-item label="订单日期" class="orderNo">{{ dataForm.orderDate }}</el-descriptions-item>
                  <el-descriptions-item label="交货日期">{{ dataForm.deliveryDate }}</el-descriptions-item>



                  <el-descriptions-item label="含税总金额">{{ dataForm.totalAmount }}</el-descriptions-item>
                  <el-descriptions-item label="不含税总金额">{{ dataForm.excludingTaxTotalAmount }}</el-descriptions-item>
                  <el-descriptions-item label="税额">{{ dataForm.taxAmount }}</el-descriptions-item>

                </el-descriptions>
                <!-- <img class="JJImg" v-if="dataForm.urgentFlag" src="@/assets/images/emergency.png" alt="" style="bottom: 0;"> -->
                <img class="JJ" v-if="dataForm.orderStatus == 'not_finish'" src="@/assets/images/incomplete.png" alt="">
                <img class="JJ" v-if="dataForm.orderStatus == 'finish'" src="@/assets/images/successing.png" alt="">
                <img class="JJ" v-if="dataForm.orderStatus == 'part_finish'"
                  src="@/assets/images/partiallyCompleted.png" alt="">
              </div>

            </el-collapse-item>
            <!-- <el-collapse-item title="" name="info" class="info" :disabled="true"> -->
            <el-collapse-item title="订单产品" name="product">
              <JNPF-table :data="productData" fixedNO v-loading="tableloading" class="productTable"
                @row-click="handleRowClick">
                <el-table-column prop="customerProductNo" label="客户料号" width="160" :key="1212">
                </el-table-column>
                <el-table-column prop="drawingNo" label="品名规格" min-width="320" :key="6">
                </el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="140" :key="4" />
                <el-table-column prop="mainUnit" label="单位" width="80" :key="8" />




                <el-table-column prop="progressStatus" label="订单状态" width="120" :key="68">
                  <template slot-scope="scope">
                    <div v-if="scope.row.progressStatus == 'ps001'">已下订单</div>
                    <div v-if="scope.row.progressStatus == 'ps002'">已转计划</div>
                    <div v-if="scope.row.progressStatus == 'ps003'">已运算计划</div>
                    <div v-if="scope.row.progressStatus == 'ps004'">已排产</div>
                    <div v-if="scope.row.progressStatus == 'ps005'">已生产</div>
                    <div v-if="scope.row.progressStatus == 'ps006'">已入库</div>
                    <div v-if="scope.row.progressStatus == 'ps007'">已发货</div>
                  </template>
                </el-table-column>
                <el-table-column prop="totalProgress" label="订单进度" width="120" :key="68">
                  <template slot-scope="scope">
                    <el-progress :percentage="scope.row.totalProgress || 0"></el-progress>
                  </template>
                </el-table-column>

                <el-table-column prop="num" label="订单数量" width="120" :key="58">
                  <template slot-scope="scope">
                    <div>{{ scope.row.num ? scope.row.num : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planQuantity" label="计划数量" width="120" :key="84">
                  <template slot-scope="scope">
                    <div>{{ scope.row.planQuantity ? scope.row.planQuantity : 0 }}</div>
                  </template>
                </el-table-column>

                <el-table-column prop="outboundQuantity" label="出库数量" width="120" :key="38">
                  <template slot-scope="scope">
                    <div>{{ scope.row.outboundQuantity ? scope.row.outboundQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="producedQuantity" label="生产入库数量" width="120" :key="38">
                  <template slot-scope="scope">
                    <div>{{ scope.row.producedQuantity ? scope.row.producedQuantity : 0 }}</div>
                  </template>
                </el-table-column>

                <!-- <el-table-column prop="num" label="订单金额" width="100" :key="7">
                </el-table-column>
                <el-table-column prop="price" label="收款金额" width="120" :key="11">
                </el-table-column> 
                <el-table-column prop="deliveryDate" label="欠款金额" width="180" :key="131"></el-table-column>
                <el-table-column prop="excludingTaxAmount" label="开票金额" width="140" :key="126">
                  <template slot-scope="scope">
                    <div>{{ scope.row.excludingTaxAmount ? scope.row.excludingTaxAmount : 0 }}</div>
                  </template>
                </el-table-column> -->

                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="viewFun(scope.row.ordersId, 'look')">详情</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <el-radio-group v-model="categoryType"
                style="width:100%;padding-left: 5px;border-bottom: 1px solid #dcdfe6 ;">
                <el-radio-button v-for="item in categoryTypeList" :key="item.code" style="height: 100%;"
                  :label="item.code">{{
                    item.fullName
                  }}</el-radio-button>
              </el-radio-group>
              <!-- 订单计划 -->
              <div v-if="categoryType == 'plan'">
                <div class="stoclInfo">
                  <el-descriptions :column="1" class="orderNo">
                    <el-descriptions-item label="计划单号">{{ planData.planNo
                      }}</el-descriptions-item>

                  </el-descriptions>

                  <el-descriptions class="margin-top" :column="4">
                    <el-descriptions-item label="需求数量">{{ planData.planQuantity }}{{ planData.mainUnit
                      }}</el-descriptions-item>
                    <el-descriptions-item label="宽放需求数量">{{ planData.relaxQuantity }}{{ planData.mainUnit
                      }}</el-descriptions-item>
                    <el-descriptions-item label="利用库存数量">{{ planData.utilizationQuantity }}{{ planData.mainUnit
                      }}</el-descriptions-item>
                    <el-descriptions-item label="生产数量">{{ planData.productionQuantity }}{{ planData.mainUnit
                      }}</el-descriptions-item>
                    <el-descriptions-item label="采购数量">{{ planData.purchaseQuantity }}{{ planData.mainUnit
                      }}</el-descriptions-item>
                    <el-descriptions-item label="外协数量">{{ planData.outsourcingQuantity }}{{ planData.mainUnit
                      }}</el-descriptions-item>

                    <el-descriptions-item label="打字内容">{{ planData.sealingCoverTyping }}</el-descriptions-item>
                    <el-descriptions-item label="精度等级">{{ planData.accuracyLevel }}</el-descriptions-item>
                    <el-descriptions-item label="振动等级">{{ planData.vibrationLevel }}</el-descriptions-item>
                    <el-descriptions-item label="油脂">{{ planData.oil }}</el-descriptions-item>
                    <el-descriptions-item label="油脂量">{{ planData.oilQuantity }}</el-descriptions-item>
                    <el-descriptions-item label="游隙">{{ planData.clearance }}</el-descriptions-item>
                    <el-descriptions-item label="包装方式">{{ planData.packagingMethod }}</el-descriptions-item>
                    <el-descriptions-item label="特殊要求">{{ planData.specialRequire }}</el-descriptions-item>
                    <el-descriptions-item label="计划日期">{{ planData.planStartDate }}至{{ planData.planEndDate
                      }}</el-descriptions-item>
                  </el-descriptions>
                </div>

                <div class="gantt">甘特图信息</div>
                <div ref='ganttRef'>
                </div>
                <section style='display: flex;justify-content: start;'>

                </section>
              </div>
              <!-- 成品采购 -->
              <div v-if="categoryType == 'finishpurchase'">
                <JNPF-table ref="finishpurchase" :data="purchaseData" fixedNO v-loading="tableloading" :height="height">
                  <el-table-column prop="orderNo" label="采购单号" min-width="200">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewPurchaseFun(scope.row.id, 'look')">
                        {{ scope.row.orderNo }}
                      </el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                  <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="110" />
                  <el-table-column prop="excludingTaxTotalAmount" label="总金额(不含税)" width="160" />
                  <el-table-column prop="taxAmount" label="税额" width="80" />
                  <el-table-column prop="totalAmount" label="总金额(含税)" width="140" />
                  <el-table-column prop="receivingStatus" label="订单状态" align="center" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'not_finished'">
                        <el-tag>未完成</el-tag>
                      </div>
                      <div v-if="scope.row.receivingStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
                      <div v-if="scope.row.approvalStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" min-width="140" label="备注" />
                  <el-table-column prop="createTime" label="创建时间" min-width="180" />
                  <el-table-column prop="createByName" label="创建人" />

                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="viewPurchaseFun(scope.row.id, 'look')">详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
              </div>
              <!-- 原材料采购 -->
              <div v-if="categoryType == 'rawpurchase'">
                <JNPF-table ref="rawpurchase" :height="height" :data="rawData" fixedNO v-loading="tableloading">
                  <el-table-column prop="orderNo" label="采购单号" min-width="200">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewPurchaseFun(scope.row.id, 'look')">
                        {{ scope.row.orderNo }}
                      </el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                  <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="110" />
                  <el-table-column prop="excludingTaxTotalAmount" label="总金额(不含税)" width="160" />
                  <el-table-column prop="taxAmount" label="税额" width="80" />
                  <el-table-column prop="totalAmount" label="总金额(含税)" width="140" />
                  <el-table-column prop="receivingStatus" label="订单状态" align="center" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'not_finished'">
                        <el-tag>未完成</el-tag>
                      </div>
                      <div v-if="scope.row.receivingStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
                      <div v-if="scope.row.approvalStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" min-width="140" label="备注" />
                  <el-table-column prop="createTime" label="创建时间" min-width="180" />
                  <el-table-column prop="createByName" label="创建人" />

                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="viewPurchaseFun(scope.row.id, 'look')">详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
              </div>
              <!-- 成品外协 -->
              <div v-if="categoryType == 'finishedOut'">
                <JNPF-table ref="finishedOut" :height="height" :data="finishExtendData" fixedNO
                  v-loading="tableloading">
                  <el-table-column prop="orderNo" label="外协单号" min-width="200">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewFinishExtendFun(scope.row.id, 'look')">
                        {{ scope.row.orderNo }}
                      </el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                  <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="120" />
                  <el-table-column prop="excludingTaxTotalAmount" label="总金额(不含税)" width="180" />
                  <el-table-column prop="taxAmount" label="税额" width="120" />
                  <el-table-column prop="totalAmount" label="总金额(含税)" width="140" />
                  <el-table-column prop="receivingStatus" label="订单状态" align="center" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'not_finished'">
                        <el-tag>未完成</el-tag>
                      </div>
                      <div v-if="scope.row.receivingStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
                      <div v-if="scope.row.approvalStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" min-width="140" label="备注" />
                  <el-table-column prop="createTime" label="创建时间" min-width="180" />
                  <el-table-column prop="createByName" label="创建人" />
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click.native="viewFinishExtendFun(scope.row.id, 'look')">
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>

                </JNPF-table>
              </div>
              <!-- 工序外协 -->
              <div v-if="categoryType == 'processOut'">
                <JNPF-table ref="processOut" :height="height" :data="processOutData" fixedNO v-loading="tableloading">
                  <el-table-column prop="orderNo" label="外协单号" min-width="200">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewFinishExtendFun(scope.row.id, 'look')">
                        {{ scope.row.orderNo }}
                      </el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cooperativePartnerCode" label="供应商编码" min-width="180" />
                  <el-table-column prop="cooperativePartnerName" label="供应商名称" min-width="180" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="120" />
                  <el-table-column prop="excludingTaxTotalAmount" label="总金额(不含税)" width="180" />
                  <el-table-column prop="taxAmount" label="税额" width="120" />
                  <el-table-column prop="totalAmount" label="总金额(含税)" width="140" />
                  <el-table-column prop="receivingStatus" label="订单状态" align="center" width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.receivingStatus == 'not_finished'">
                        <el-tag>未完成</el-tag>
                      </div>
                      <div v-if="scope.row.receivingStatus == 'finished'"><el-tag type="success">已完成</el-tag></div>
                      <div v-if="scope.row.approvalStatus == 'stopped'"><el-tag type="danger">已停止</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" min-width="140" label="备注" />
                  <el-table-column prop="createTime" label="创建时间" min-width="180" />
                  <el-table-column prop="createByName" label="创建人" />
                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click.native="viewFinishExtendFun(scope.row.id, 'look')">
                        查看详情
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="viewFun(scope.row.ordersId, 'look')">详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
              </div>

              <!-- 出入库记录 -->
              <div v-if="categoryType == 'outinboundwarehouse'">
                <JNPF-table ref="outinboundwarehouse" :height="height" :data="outInboundData" fixedNO
                  v-loading="tableloading">
                  <el-table-column prop="orderNo" label="单号" min-width="180">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewOutInbound(scope.row, 'look')">{{
                        scope.row.orderNo
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="businessType" label="业务类型" min-width="120">
                    <template slot-scope="scope">
                      <div v-if="scope.row.businessType == 'outbound_sale_send'">销售发货</div>
                      <div v-if="scope.row.businessType == 'inbound_sale_return'">销售退货</div>

                    </template>
                  </el-table-column>
                  <el-table-column prop="partnerName" label="客户/供应商" min-width="160">

                  </el-table-column>
                  <el-table-column prop="partnerCode" label="客户/供应商编码" min-width="180"></el-table-column>
                  <el-table-column prop="inspectionResults" label="检验标志" min-width="120">
                    <template slot-scope="scope">
                      <el-tag type="success" v-if="scope.row.inspectionResults == 'qualified'">合格</el-tag>
                      <el-tag type="danger" v-else-if="scope.row.inspectionResults == 'unqualified'">不合格</el-tag>
                      <el-tag v-else-if="scope.row.inspectionResults == 'unInspect'">待检验</el-tag>
                    </template>

                  </el-table-column>

                  <el-table-column prop="documentStatus" label="单据状态" min-width="120">
                    <template slot-scope="scope">
                      <el-tag type="warning" v-if="scope.row.documentStatus == 'draft'">草稿</el-tag>
                      <el-tag type="success" v-else-if="scope.row.documentStatus == 'submit'">提交</el-tag>
                    </template>

                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="180" />
                  <el-table-column prop="createTime" label="创建时间" min-width="180" />
                  <el-table-column prop="createByName" label="创建人" width="120" />

                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="viewOutInbound(scope.row, 'look')">详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
              </div>
              <!-- 发货记录 -->
              <div v-if="categoryType == 'shipmentRecord'">
                <JNPF-table ref="shipmentRecord" :height="height" :data="shipmentData" fixedNO v-loading="tableloading"
                  @row-click="handleRowClick">
                  <<el-table-column prop="orderNo" label="单号" min-width="200">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewShipmentFun(scope.row.id, 'look')">{{
                        scope.row.orderNo
                      }}</el-link>
                    </template>
                    </el-table-column>
                    <el-table-column prop="partnerCode" label="客户编码" min-width="200" />
                    <el-table-column prop="partnerName" label="客户名称" min-width="200" />
                    <el-table-column prop="deliverDate" label="发货日期" min-width="120"></el-table-column>
                    <el-table-column prop="recipient" label="收件人" min-width="120" />
                    <el-table-column prop="phone" label="收件人电话" min-width="140" />

                    <el-table-column prop="delivery" label="发货方式" min-width="120">
                      <template slot-scope="scope">

                        <div v-for="(item, index) in departMentList" :key="index">{{ scope.row.delivery == item.value ?
                          item.label : ""
                          }}</div>
                      </template>
                    </el-table-column>

                    <el-table-column prop="exchangeGoodsFlag" label="发货标识" width="120">
                      <template slot-scope="scope">
                        <div v-if="scope.row.exchangeGoodsFlag">
                          换货发货
                        </div>
                        <div v-else>
                          正常发货
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="deliveryStatus" label="发货状态" min-width="120" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.deliveryStatus == 'not_finished'">
                          <el-tag type="primary">未完成</el-tag>
                        </div>
                        <div v-else-if="scope.row.deliveryStatus == 'finished'">
                          <el-tag type="success">已完成 </el-tag>
                        </div>
                        <div v-else-if="scope.row.deliveryStatus == 'canceled'">
                          <el-tag type="danger">已取消</el-tag>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="documentStatus" label="单据状态" min-width="120">
                      <template slot-scope="scope">
                        <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                        <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" min-width="140" />

                    <el-table-column label="操作" width="100" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="viewShipmentFun(scope.row.id, 'look')">详情</el-button>
                      </template>
                    </el-table-column>
                </JNPF-table>
              </div>
              <!-- 退货记录 -->
              <div v-if="categoryType == 'returnRecord'">
                <JNPF-table ref="returnRecord" :height="height" :data="returnData" fixedNO v-loading="tableloading">
                  <el-table-column prop="orderNo" label="单号" min-width="180" key="orderNo">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewReturnFun(scope.row.id, 'look')">{{
                        scope.row.orderNo
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="partnerCode" label="客户编码" min-width="160" key="partnerCode" />
                  <el-table-column prop="partnerName" label="客户名称" min-width="120" key="partnerName" />
                  <el-table-column prop="deliverDate" label="退货日期" width="180" key="deliverDate"></el-table-column>
                  <el-table-column prop="exchangeGoodsFlag" label="退货标识" width="120" key="exchangeGoodsFlag">
                    <template slot-scope="scope">
                      <div v-if="scope.row.exchangeGoodsFlag">
                        换货
                      </div>
                      <div v-else>
                        退货
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="deliveryStatus" label="退货状态" width="120" key="deliveryStatus" align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.deliveryStatus == 'not_finished'">
                        <el-tag type="primary">未完成</el-tag>
                      </div>
                      <div v-else-if="scope.row.deliveryStatus == 'finished'">
                        <el-tag type="success">已完成 </el-tag>
                      </div>
                      <div v-else-if="scope.row.deliveryStatus == 'canceled'">
                        <el-tag type="danger">已取消</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="documentStatus" label="单据状态" width="120" key="documentStatus">
                    <template slot-scope="scope">
                      <div v-if="scope.row.documentStatus == 'draft'"><el-tag type="warning">草稿</el-tag> </div>
                      <div v-if="scope.row.documentStatus == 'submit'"><el-tag type="success">提交</el-tag></div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="180" key="createTime"></el-table-column>
                  <el-table-column prop="createByName" label="创建人" width="140" key="createByName" />

                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="viewReturnFun(scope.row.id, 'look')">详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
              </div>
              <!-- 对账记录 -->
              <div v-if="categoryType == 'reconciliation'">
                <JNPF-table ref="reconciliation" :height="height" :data="reconciliationData" fixedNO
                  v-loading="tableloading">
                  <el-table-column prop="orderNo" label="对账单号" min-width="180">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewReconciliationFun(scope.row.id, 'look')">{{
                        scope.row.orderNo
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="reconciliationDate" label="对账日期" min-width="180" />

                  <!-- <el-table-column prop="orderNo" label="对账单号" width="180"  /> -->
                  <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="200" />
                  <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="200" />
                  <el-table-column prop="excludingTaxAmount" label="不含税总金额" min-width="180">
                    <template slot-scope="scope">
                      <div :class="scope.row.excludingTaxAmount > 0 ? 'green' : 'red'">{{ scope.row.excludingTaxAmount >
                        0 ? '+'
                      + scope.row.excludingTaxAmount : scope.row.excludingTaxAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="taxAmount" label="总税额" min-width="180">
                    <template slot-scope="scope">
                      <div :class="scope.row.taxAmount > 0 ? 'green' : 'red'">{{ scope.row.taxAmount > 0 ? '+' +
                        scope.row.taxAmount : scope.row.taxAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="includingTaxAmount" label="含税总金额" min-width="180">
                    <template slot-scope="scope">
                      <div :class="scope.row.includingTaxAmount > 0 ? 'green' : 'red'">{{ scope.row.includingTaxAmount >
                        0 ? '+'
                      + scope.row.includingTaxAmount : scope.row.includingTaxAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalReconciliationAmount" label="对账金额" min-width="180">
                    <template slot-scope="scope">
                      <div :class="scope.row.totalReconciliationAmount > 0 ? 'green' : 'red'">{{
                        scope.row.totalReconciliationAmount > 0 ? '+' + scope.row.totalReconciliationAmount :
                          scope.row.totalReconciliationAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalPaymentAmount" label="已收款金额" min-width="180">
                    <template slot-scope="scope">
                      <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">{{ scope.row.totalPaymentAmount >
                        0 ? '+'
                      + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="totalInvoicingAmount" label="已开票金额" min-width="180">
                    <template slot-scope="scope">
                      <div :class="scope.row.totalInvoicingAmount > 0 ? 'green' : 'red'">{{
                        scope.row.totalInvoicingAmount > 0 ?
                          '+' + scope.row.totalInvoicingAmount : scope.row.totalInvoicingAmount }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="180" />
                  <el-table-column prop="createTime" label="创建时间" width="180" />
                  <el-table-column prop="createByName" label="创建人" min-width="180" />
                  <el-table-column prop="approvalStatus" label="审批状态" align="center" min-width="120"
                    v-if="showAppCodeFlag">
                    <template slot-scope="scope">
                      <div v-if="scope.row.approvalStatus == 'ing'"><el-tag>审批中</el-tag> </div>
                      <div v-if="scope.row.approvalStatus == 'ok'"><el-tag type="success">审批通过</el-tag></div>
                      <div v-if="scope.row.approvalStatus == 'rebut'"><el-tag type="danger">审批拒绝</el-tag></div>
                      <div v-if="scope.row.approvalStatus == 'withdrawn' && scope.row.documentStatus == 'submit'">
                        <el-tag type="warning">审批撤回</el-tag>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" size="mini"
                        @click.native="viewReconciliationFun(scope.row.accountsReceivableReconciliationId, 'look')">
                        详情</el-button>
                    </template>
                  </el-table-column>


                </JNPF-table>
              </div>

              <!-- 收退款记录 -->
              <div v-if="categoryType == 'receivePayRefund'">
                <JNPF-table ref="receivePayRefund" :height="height" :data="receivePayRefundData" fixedNO
                  v-loading="tableloading">
                  <el-table-column prop="orderNo" label="对账单号" min-width="180">
                    <template slot-scope="scope">
                      <el-link type="primary"
                        @click.native="viewReceivePayRefundFun(scope.row.accountsReceivableReconciliationId, 'look', scope.row.orderNo)">{{
                          scope.row.orderNo
                        }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="reconciliationDate" label="对账日期" min-width="180" />

                  <!-- <el-table-column prop="orderNo" label="对账单号" width="180"  /> -->
                  <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="200" />
                  <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="200" />
                  <el-table-column prop="includingTaxAmount" label="出入库金额" min-width="180">
                  </el-table-column>
                  <el-table-column prop="totalReconciliationAmount" label="应收金额" min-width="180">

                  </el-table-column>
                  <el-table-column prop="totalPaymentAmount" label="已收款金额" min-width="180">

                  </el-table-column>
                  <el-table-column prop="totalUnpaidAmount" label="未收款金额" min-width="180">
                    <template slot-scope="scope">
                      <div>{{ scope.row.totalUnpaidAmount ? scope.row.totalUnpaidAmount : 0 }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="remark" label="备注" min-width="180" />

                  <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" size="mini"
                        @click.native="viewReceivePayRefundFun(scope.row.accountsReceivableReconciliationId, 'look', scope.row.orderNo)">
                        详情</el-button>
                    </template>
                  </el-table-column>


                </JNPF-table>
              </div>


              <!-- 开票记录 -->
              <div v-if="categoryType == 'invoice'">
                <JNPF-table ref="invoice" :height="height" :data="invoiceData" fixedNO v-loading="tableloading">
                  <el-table-column prop="orderNo" label="对账流水号" min- width="160" :key="1212">
                    <template slot-scope="scope">
                      <el-link type="primary" @click.native="viewInvoiceFun(scope.row.id, 'look', scope.row.orderNo)">{{
                        scope.row.orderNo
                      }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="reconciliationDate" label="对账日期" min-width="160" :key="6">
                  </el-table-column>
                  <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="160" :key="4" />
                  <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="160" :key="18" />
                  <el-table-column prop="includingTaxAmount" label="出入库金额" min-width="160" :key="28" />
                  <el-table-column prop="totalReconciliationAmount" label="应付金额" min-width="160" :key="83" />
                  <el-table-column prop="totalPaymentAmount" label="已收款金额" min-width="160" :key="38" />
                  <el-table-column prop="totalUnpaidAmount" label="未收款金额" min-width="160" :key="48" />
                  <el-table-column prop="remark" label="备注" min-width="160" :key="58" />

                  <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text"
                        @click="viewInvoiceFun(scope.row.id, 'look', scope.row.orderNo)">详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
              </div>
            </el-collapse-item>


            <!-- </el-collapse-item> -->
          </el-collapse>
        </div>
      </div>


    </transition>

    <Form v-if="formVisible" ref="form" @close="closeFun"></Form>
    <ShipementForm v-if="shipmentVisible" ref="shipmentForm" @close="closeFun" />
    <ReturnForm v-if="returnVisible" ref="returnForm" @close="closeFun" />
    <SaleOutboundForm v-if="saleOutboundFormVisible" ref="saleOutboundREFForm" @close="closeFun"></SaleOutboundForm>
    <OutboundSaleSendForm v-if="outboundSaleSendFormVisible" ref="outboundSaleSendREFForm" @close="closeFun">
    </OutboundSaleSendForm>
    <InboundSaleReturnForm v-if="inboundSaleReturnFormVisible" ref="inboundSaleReturnREFForm" @close="closeFun">
    </InboundSaleReturnForm>
    <Reconciliation v-if="reconciliationVisible" ref="reconciliationForm" @close="closeFun"></Reconciliation>
    <ReceivePayRefundForm v-if="receivePayRefundVisible" ref="receivePayRefundForm" @close="closeFun">
    </ReceivePayRefundForm>
    <InvoiceForm v-if="invoiceVisibled" ref="invoiceForm" @close="closeFun" />
    <PurchaseForm v-if="purchaseVisibled" ref="purchaseForm" @close="closeFun" />
    <ExtendForm v-if="extendVisible" ref="extendForm" @close="closeFun"></ExtendForm>
  </div>
</template>
<script>
import { getOrderDetail } from '@/api/salesManagement/assemblyOrders'
import { detailordershengchan } from '@/api/productOrdes/index.js'
import { getWorkReportList } from "@/api/productOrdes/index.js"
import { getPlanList, getPlanSchedule } from "@/api/calculationList/calculationList.js"
import ShipementForm from '@/views/salesManagement/shippingnotice/saleMetalworking/Form.vue'
import Form from '../orderList/Form.vue'
import ReturnForm from '@/views/salesManagement/shippingnotice/returnSalesmemo/Form.vue'
import { getInspectionList, deleteInspectionData, getInspectionLinesList } from '@/api/inspectionManagement/index' // 检验单
import { getProductionPlanList } from '@/api/productionManagement/index'
import { getQuotationdatasendlist } from '@/api/salesManagement'
import { getbimProductAttributes } from '@/api/masterDataManagement/index'
import { getWarehouseList } from '@/api/warehouseManagement/inboundAndOutbound'
import SaleOutboundForm from '@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/saleOutboundForm.vue'
import OutboundSaleSendForm from '@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/outboundSaleSendForm.vue'
import InboundSaleReturnForm from '@/views/warehouseManagement/finishedProductWarehouseManagement/dbIncomAndOutInventory/inboundSaleReturnForm.vue'
import { getfinAccountList, getfinAccountsReport } from '@/api/ReconciliaRePayments/index'
import { addfinInvoiceRecords, getfinPaymentRecords } from "@/api/financialManagement/index";
import Reconciliation from '@/views/salesManagement/saleReconciliationManagement/salesReconManagement/Form.vue'
import ReceivePayRefundForm from '@/views/financialManagement/components/pay/depForm.vue'
import InvoiceForm from '@/views/financialManagement/components/collect/depForm.vue'
import { purchaseOrderList } from '@/api/purchasingAndOutsourcingOrders/index.js'
import PurchaseForm from '@/views/purchasingManagement/purchaseOrders/purchaseOrder/Form.vue'
import ExtendForm from '@/views/outsourcingManagement/productOutsourcingOrder/orderList/Form.vue'
import { gantt } from 'dhtmlx-gantt' // 引入dhtmlx-gantt
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
export default {
  components: {
    Form, ShipementForm, ReturnForm, SaleOutboundForm, OutboundSaleSendForm, InboundSaleReturnForm, Reconciliation, ReceivePayRefundForm, InvoiceForm, PurchaseForm, ExtendForm
  },
  data() {
    return {
      extendVisible: false,
      processOutData: [],
      finishExtendData: [],
      rawData: [],
      purchaseVisibled: false,
      purchaseData: [],
      invoiceVisibled: false,
      receivePayRefundVisible: false,
      invoiceData: [],
      reconciliationVisible: false,
      receivePayRefundData: [],
      reconciliationData: [],
      inboundSaleReturnFormVisible: false,
      saleOutboundFormVisible: false,
      outboundSaleSendFormVisible: false,
      returnData: [],
      returnVisible: false,
      outInboundData: [],
      shipmentVisible: false,
      formVisible: false,
      categoryType: "plan",
      height: 0,
      relatedTaskVisible: false,
      categoryTypeList: [
        { code: "plan", fullName: "订单计划", },
        { code: "finishpurchase", fullName: "成品采购", },
        { code: "rawpurchase", fullName: "原材料采购", },
        { code: "finishedOut", fullName: "成品外协", },
        { code: "processOut", fullName: "子件外协", },
        // { code: "outbounwarehouse", fullName: "出库记录", },
        { code: "shipmentRecord", fullName: "发货记录", },
        { code: "returnRecord", fullName: "退货记录", },
        { code: "outinboundwarehouse", fullName: "出入库记录", },
        { code: "reconciliation", fullName: "对账记录", },
        { code: "receivePayRefund", fullName: "收退款记录", },

        // { code: "receivePay", fullName: "收款记录", },
        // { code: "refund", fullName: "退款记录", },
        { code: "invoice", fullName: "开票记录", },

      ],
      shipmentData: [],
      productData: [],
      orderTypeList: [
        { label: "正常订单", value: "normal", },
        { label: "返工订单", value: "rework", },
      ],


      urgentFlagList: [

        { label: "是", value: true, },

        { label: "否", value: false, },

      ],

      planData: {
        planNo: "",
        planQuantity: "",
        mainUnit: "",
        relaxQuantity: "",
        utilizationQuantity: "",
        purchaseQuantity: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        planStartDate: "",
        planEndDate: "",
      },

      activeNames1: ["basicInfo", 'product', 'planGantt'],



      feedData: [],

      workOrderData: [],

      dataForm: {},

      formLoading: false,

      btnType: "",

      title: "",

      prodOrderId: "",
      inspectData: [],
      orderLinesId: "",
      currentIndex: 0,
      departMentList: [],
      requestObj: {
        ordersLineId: "",
        approvalStatus: 'ok',
        orderType: "",
        pageNum: 1,
        pageSize: -1,
        source: "",
      },
      gantttt: {
        data: [

          /**
           *
           id：任务标识，可用来标识父子关系、连接links等
           start_date,end_date：项目开始截至时间 Date|string //（‘14-07-2022’）
           text：文本，任务的显示文字
           progress：项目的进度，用颜色深浅显示
           parent：父子关系(id标识)；子任务的parent为父任务的id
           type：任务类型，有三种，object，task，milestone；
                 object：没有时间限制，长度为包含所有子任务的长度
                 task：普通任务
                 milestone：菱形块，可表示中转关系
           * */
        ],
        links: [
          { id: 1, source: 11, target: 12, type: '0' },
          { id: 2, source: 12, target: 13, type: '0' },
          { id: 3, source: 13, target: 14, type: '0' },

          { id: 4, source: 111, target: 112, type: '0' },
          { id: 5, source: 112, target: 113, type: '0' },

          { id: 6, source: 121, target: 123, type: '0' },
          { id: 7, source: 122, target: 123, type: '0' },

          // { id: 1, source: 1, target: 3, type: '0' },
          // { id: 2, source: 1232354422, target: 1232354421, type: '0' },
          // { id: 3, source: 12345453, target: 12345437, type: '0' }
        ]
      },
      ganttColumns: [
        // { align: 'right', name: 'color', label: '', width: '150',
        //   template:function(task){
        //     if(task.color){
        //       console.log(task.color)
        //       return  "<div style='width: 10px;height: 10px;' style='background:"+ task.color+ "'>"+"</div>"}
        //   }
        // },
        { align: 'left', name: 'text', label: '', tree: true, width: "*", min_width: 180, },
        // { align: 'center', name: 'person', label: '负责人', width: '120' },
        // { align: 'right', name: 'time', label: '时间节点', width: '80' },
        { align: 'center', name: 'progress', label: '进度', width: '120', template: (task) => task.progress * 100 + '%' },
      ]
    }

  },

  watch: {

    'categoryType': function (newVal) {
      this.getTabdataList()
    },
  },
  mounted() {
    this.switchStyle()
    // 清空之前的配置
    gantt.clearAll();
    // 默认配置
    gantt.plugins({
      marker: true,
    });
    // const markerId = gantt.addMarker({
    //   start_date: new Date(2023, 4, 26),
    //   css: 'marker',
    //   text: 'makerId aaaa',
    // });
    //任务的点击方法
    gantt.attachEvent("onTaskClick", function (id, e) {
      if (e.target.className === 'gantt_task_content') { //点击内容
        console.log(id, e.target)
      }
      return true;
    });
    // 显示到任务上的文本
    gantt.templates.task_text = function (start, end, task) {
      if (!task.parent) {
        return "" + task.text + "<span style='margin-left:20px;'></span>" + task
          .completedQuantity + "/" + task.productionQuantity;
      } else {
        return "" + task.text + "<span style='margin-left:20px;'></span>" + task
          .qualifiedQuantity + "/" + task.productionQuantity;
      }

    };
    gantt.config.autofit = false;
    gantt.config.column_width = 50;
    gantt.config.work_time = true;
    gantt.i18n.setLocale('cn'); // 设置中文
    gantt.config.readonly = true; // 设置为只读
    gantt.config.bar_height = 32; //task高度
    //自适应甘特图的尺寸大小, 使得在不出现滚动条的情况下, 显示全部任务
    gantt.config.autosize = true;
    //激活列表展开、折叠功能
    gantt.config.open_split_tasks = true;
    //用户可以通过拖拽调整行高
    gantt.config.resize_rows = true;
    //图标项目栏可以任意拖拽
    gantt.config.order_branch = true;
    gantt.config.order_branch_free = true;
    //设置甘特图表头高度
    gantt.config.scale_height = 32;
    //点击表头可排序
    gantt.config.sort = false;
    // 显示列配置，限制最大最小时间
    // gantt.config.start_date = new Date(2023, 3, 25);
    // gantt.config.end_date = new Date(2023, 5, 26);
    gantt.config.columns = this.ganttColumns;
    gantt.config.scales = [
      { unit: 'month', step: 1, format: '%Y年%F' },
      { unit: 'day', step: 1, format: this.formatWeekday },
    ];
    // gantt.getMarker(markerId);
    // 初始化甘特图

    gantt.templates.task_class = (start, end, task) => {
      console.log(task.progress);
      if (task.progress == 0) return 'Noproduc'
      if (task.progress < 0.5) {
        return "low-progress"; //进度低于50%  
      } else if (task.progress < 1.0) {
        return "mid-progress"; //进度在50%-99%之间 
      } else {
        return "high-progress"; // 完成 }  
      };
    }
    const style = document.createElement('style');
    style.innerHTML = `  
    .Noproduc{
    background-color:"#ccc!important"
    }
      .low-progress {  
      color:red!important; /*低进度颜色 */  
      }  
      .mid-progress {  
      background-color: #67c23a; /* 中等进度颜色 */  
      }  
      .high-progress {  
      background-color: #67c23a; /* 高进度颜色 */  
      }  
      `;
    document.head.appendChild(style);

  },
  methods: {
    formatWeekday(date) { //1号 周一
      const dateToStr = gantt.date.date_to_str("%d");
      const dateToStrss = gantt.date.date_to_str("%Y年");
      const dateToStrs = gantt.date.date_to_str("%M");
      // return dateToStrss(date)+dateToStrs(date)+dateToStr(date)+'日';
      return dateToStr(date) + '日';
    },

    viewFinishExtendFun(id, type) {
      this.extendVisible = true
      this.$nextTick(() => {
        this.$refs.extendForm.init(id, type)
      })
    },
    viewPurchaseFun(id, type) {
      this.purchaseVisibled = true
      this.$nextTick(() => {
        this.$refs.purchaseForm.init(id, type)
      })
    },
    viewInvoiceFun(id, type, orderNo) {
      this.invoiceVisibled = true
      this.$nextTick(() => {
        this.$refs.invoiceForm.init(id, type, orderNo)
      })
    },
    viewReceivePayRefundFun(id, type, orderNo) {
      this.receivePayRefundVisible = true
      this.$nextTick(() => {
        this.$refs.receivePayRefundForm.init(id, type, orderNo)
      })
    },
    // 查看对账
    viewReconciliationFun(id, type) {
      this.reconciliationVisible = true
      this.$nextTick(() => {
        this.$refs.reconciliationForm.init(id, type)
      })

    },
    // 查看出入库详情
    viewOutInbound(row, type) {
      // 销售发货
      if (row.businessType == 'outbound_sale_send') {
        // 按订单
        if (row.sourceType == 'order') {
          this.saleOutboundFormVisible = true
          this.$nextTick(() => {
            this.$refs.saleOutboundREFForm.init(row.id, type, row.businessType)
          })
        } else if (row.sourceType == 'notice') {
          // 按通知单
          this.outboundSaleSendFormVisible = true
          this.$nextTick(() => {
            this.$refs.outboundSaleSendREFForm.init(row.id, type, row.businessType)
          })
        }
      } else if (row.businessType == 'inbound_sale_return') {
        // 销售退货
        this.inboundSaleReturnFormVisible = true
        this.$nextTick(() => {
          this.$refs.inboundSaleReturnREFForm.init(row.id, type, row.businessType)
        })
      }
    },
    viewReturnFun(id, type) {
      this.returnVisible = true
      this.$nextTick(() => {
        this.$refs.returnForm.init(id, type)
      })
    },
    getbimProductAttributesFun() {
      getbimProductAttributes('595170644241464069').then(res => {
        res.data.list.forEach(item => {
          let obj = {
            label: item.fullName,
            value: item.enCode
          }
          this.departMentList.push(obj)
        });
      })
    },
    handleRowClick(val) {
      console.log("val", val);
    },
    viewShipmentFun(id, type) {
      this.shipmentVisible = true
      this.$nextTick(() => {
        this.$refs.shipmentForm.init(id, type)
      })
    },
    // 产品信息详情
    viewFun(id) {
      // 详情
      this.orderLinesId = id
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.form.init(id, 'look')
      })
    },
    closeFun() {
      this.formVisible = false
      this.shipmentVisible = false
      this.returnVisible = false
      this.saleOutboundFormVisible = false
      this.outboundSaleSendFormVisible = false
      this.inboundSaleReturnFormVisible = false
      this.reconciliationVisible = false
      this.receivePayRefundVisible = false
      this.invoiceVisibled = false
      this.purchaseVisibled = false
      this.extendVisible = false
    },
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      let allHeight = this.$refs.main.clientHeight
      let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      console.log("allHeight", allHeight);
      console.log("HeightstoclInfo", HeightstoclInfo);
      this.height = (allHeight - HeightstoclInfo - 330) + 'px'
      console.log("height", this.height);
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    selectRelatedTasksFun(val) {
      this.init(val.id)
    },
    getTabdataList() {


      if (this.categoryType == 'plan') {
        // 计划
        let obj = {
          ordersLineId: this.orderLinesId,
          pageSize: -1,
          pageNum: -1,
        }
        getPlanList(obj).then(res => {
          console.log("计划信息", res);
          if (res.data.records.length) {

            this.planData = res.data.records[0]
            getPlanSchedule(this.planData.id).then(res => {
              console.log("计划进度", res);
              let arr = []
              if (!res.data.length) return
              res.data.forEach(item => {
                item.completedQuantity = item.prodOrderList.reduce((sum, order) => sum + Number(order.completedQuantity), 0);
              });
              setTimeout(() => {
                res.data.forEach(item => {
                  // let data=res.data[0]
                  let obj = {
                    id: item.id,
                    text: item.productionPlanNo,
                    progress: this.jnpf.numberFormat(this.jnpf.math('divide', [item.completedQuantity, item.planProductionQuantity]), 2),
                    type: 'task',


                    start_date: new Date(item.planStartDate == item.planEndDate ? item.planStartDate + ' 00:00:00' : item.planStartDate + " 00:00:00"),
                    end_date: new Date(item.planStartDate == item.planEndDate ? item.planEndDate + ' 23:59:59' : item.planEndDate + " 23:59:59"),
                    open: true,
                    color: 'green',
                    completedQuantity: item.completedQuantity,
                    productionQuantity: item.planProductionQuantity,
                  }
                  console.log(6666);
                  arr.push(obj)


                  if (item.prodOrderList.length) {
                    item.prodOrderList.forEach((items, index) => {

                      let bjs = {
                        id: items.id,
                        text: items.orderNo,
                        progress: this.jnpf.numberFormat(this.jnpf.math('divide', [items.completedQuantity, items.productionQuantity]), 2),
                        type: 'task',


                        start_date: new Date(items.planStartDate == items.planEndDate ? items.planStartDate + ' 00:00:00' : items.planStartDate + " 00:00:00"),
                        end_date: new Date(items.planStartDate == items.planEndDate ? items.planEndDate + ' 23:59:59' : items.planEndDate + " 23:59:59"),
                        parent: items.productionPlanId,
                        open: true,
                        qualifiedQuantity: items.completedQuantity,
                        productionQuantity: items.productionQuantity,
                        color: "green",
                      }
                      arr.push(bjs)
                      // 2. 拆分成单个项目
                      const list = items.processSchedule.split(',');

                      // 3. 将每个项目转换为对象格式
                      const result = list.map(item => {
                        const [name, progress] = item.split(':');
                        return { name: name, progress: progress };
                      });
                      if (items.workOrderList.length) {
                        console.log("items.workOrderList", items.workOrderList);
                        items.workOrderList.forEach((itemss, index) => {
                       
                          itemss.actualStartDate = itemss.actualStartDate ? itemss.actualStartDate.substring(0, 10) : ""
                          itemss.actualEndDate = itemss.actualEndDate ? itemss.actualEndDate.substring(0, 10) : ""
                          console.log("时间1", itemss.actualStartDate,);
                          console.log("时间2", itemss.actualEndDate,);
                          let bjss = {
                            id: itemss.id,
                            text: result[index].name,
                            parent: itemss.productionOrderId,
                            progress: result[index].progress / 100,
                            type: 'task',
                            start_date: new Date(itemss.actualStartDate == itemss.actualEndDate ? itemss.actualStartDate + ' 00:00:00' : itemss.actualStartDate + ' 00:00:00'),
                            end_date: new Date(itemss.actualStartDate == itemss.actualEndDate ? itemss.actualStartDate + ' 23:59:59' : itemss.actualEndDate + ' 23:59:59'),
                            qualifiedQuantity: itemss.qualifiedQuantity,
                            productionQuantity: itemss.productionQuantity,
                            duration: 20,
                            color: "green",
                          }
                          arr.push(bjss)
                        })
                      }
                    })
                  }
                  console.log("arr", arr);
                  this.$nextTick(() => {
                    this.gantttt.data = arr
                    gantt.init(this.$refs.ganttRef);
                    gantt.parse(this.gantttt)
                  })
                });
              }, 500);
            })
          }
        })
      } else if (this.categoryType == 'finishpurchase') {
        // 成品采购
        this.requestObj.source = 'plan'
        this.requestObj.ordersLineId = this.orderLinesId
        this.requestObj.orderType = 'procure'
        purchaseOrderList(this.requestObj).then(res => {
          console.log("成品采购", res);
          this.purchaseData = res.data.records
        })
      } else if (this.categoryType == 'rawpurchase') {
        // 原材料采购
        this.requestObj.source = 'mrp'
        this.requestObj.ordersLineId = this.orderLinesId
        this.requestObj.orderType = 'procure'
        purchaseOrderList(this.requestObj).then(res => {
          console.log("原材料采购", res);

          this.rawData = res.data.records
        })
      } else if (this.categoryType == 'finishedOut') {
        // 成品外协
        this.requestObj.source = 'plan'
        this.requestObj.ordersLineId = this.orderLinesId
        this.requestObj.orderType = 'external'
        purchaseOrderList(this.requestObj).then(res => {
          console.log("成品外协", res);

          this.finishExtendData = res.data.records
        })
      } else if (this.categoryType == 'processOut') {
        this.requestObj.source = 'mrp'
        this.requestObj.ordersLineId = this.orderLinesId
        this.requestObj.orderType = 'external'
        purchaseOrderList(this.requestObj).then(res => {
          console.log("子件外协", res);
          this.processOutData = res.data.records
        })
        // 工序外协
      } else if (this.categoryType == 'outinboundwarehouse') {
        // 出入库记录

        let obj = {
          ordersLineId: this.orderLinesId,
          pageNum: 1,
          documentStatus: 'submit',
          pageSize: -1,
        }
        getWarehouseList(obj).then(res => {
          console.log("出入库", res);
          this.outInboundData = res.data.records
        })
      } else if (this.categoryType == 'shipmentRecord') {
        // 发货记录
        this.departMentList = []
        this.getbimProductAttributesFun()
        let obj = {

          orderNo: "",
          partnerName: "",
          pageNum: 1,
          notifyType: "sale",
          pageSize: -1,
          returnDeliveryType: 'delivery',
          rdeDate: "",
          rdsDate: "",
          ordersLineId: this.orderLinesId

        }
        getQuotationdatasendlist(obj).then(res => {
          console.log("发货记录", res);
          this.shipmentData = res.data.records
        })
      } else if (this.categoryType == 'returnRecord') {
        // 退货记录
        let obj = {
          orderNo: "",
          partnerName: "",
          pageNum: 1,
          pageSize: -1,
          rdeDate: "",
          rdsDate: "",
          ordersLineId: this.orderLinesId,
          returnDeliveryType: 'back',
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
        }
        getQuotationdatasendlist(obj).then(res => {
          console.log("退货记录", res);
          this.$nextTick(() => {
            this.returnData = res.data.records
          })
        })
      } else if (this.categoryType == 'reconciliation') {
        // 对账记录
        let obj = {
          approvalStatus: "OK",
          // billingStatus:"finished",
          documentStatus: "submit",
          ordersLineId: this.orderLinesId,
          reconciliationType: "receivable",
          pageNum: 1,
          pageSize: -1,

          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
        }
        getfinAccountList(obj).then(res => {
          console.log('对账', res);
          this.reconciliationData = res.data.records
        })
      } else if (this.categoryType == 'receivePayRefund') {
        let obj = {
          reconciliationType: "receivable",
          ordersLineId: this.orderLinesId,
        }
        getfinPaymentRecords(obj).then(res => {
          console.log("收付款记录", res);
          this.receivePayRefundData = res.data.records
        })
        // 收款记录
      }
      // else if (this.categoryType == 'receivePay') {
      //   // 收款记录
      // } else if (this.categoryType == 'refund') {
      //   // 退款记录
      // }
      else if (this.categoryType == 'invoice') {
        // 开票记录 
        let obj = {
          approvalStatus: "OK",
          // billingStatus:"finished",
          documentStatus: "submit",
          ordersLineId: this.orderLinesId,
          reconciliationType: "receivable",
          pageNum: 1,
          pageSize: -1,
          invoiceStatus: "finished",
          orderItems: [{
            asc: false,
            column: ""
          }, {
            asc: false,
            column: "create_time"
          }],
        }
        getfinAccountsReport(obj).then(res => {
          this.invoiceData = res.data.page.records
        })

      }
    },
    goBack() {
      this.$emit('close')
    },


    init(id) {
      getOrderDetail(id).then(res => {
        console.log("销售详情详情", res);
        res.data.orderLines.forEach(item => {
          this.$set(item, 'outNum11', '')
          this.$set(item, 'outNum12', '')
          this.$set(item, 'outNum13', '')
          this.$set(item, 'outNum14', '')
          this.$set(item, 'outNum15', '')
        });
        this.dataForm = res.data.order
        this.productData = res.data.orderLines
        this.orderLinesId = this.productData[0].id
        this.getTabdataList()

      })
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



::v-deep .JNPF-common-page-header.noButtons {

  padding: 11px 10px;

}



.required {

  color: red;

  margin-right: 4px;

}
</style>

<style scoped>
::v-deep .el-tabs__content {

  height: auto !important;

  padding: 0;

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



.JNPF-common-search-box {

  padding: 8px 0px 0;

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
  margin-bottom: 0;
  border-bottom: 0 !important;
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
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}

.orderInfo {
  margin-top: 5px;
}

::v-deep.routingProRes .el-dialog__body {
  height: 500px;
}

::v-deep .applySelect .el-icon-arrow-up:before {
  content: "";
}

.underline-button {
  text-decoration: underline;
}

.personBox p {
  text-align: center;
}

.personBox:nth-child(n + 6) {
  margin-top: 12px;
}



::v-deep .elbutton span {

  font-size: 14px !important;

}



.personBox {

  border: 1px solid #dcdfe6;

  background-color: #f5f7fa;

  /* background-color: #1890ff; */

  margin-left: 26px;

  height: 150px;

  border-radius: 5px;

}



.active {

  background-color: #5d9bd5;

  color: #fff;

}



.feedInfoForm ::v-deep.el-collapse-item__wrap,

.workOrderInfoForm ::v-deep.el-collapse-item__wrap {

  padding: 0 !important;

  border-top: 1px solid #dcdfe6;

  border-right: 0 !important;

}










::v-deep .el-descriptions-item__label {
  font-size: 16px;
}

::v-deep .el-descriptions-item__content {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block !important;
  font-size: 16px;
}

.tableContainer {
  height: auto;
}

.stoclInfo {
  position: relative;
  padding: 5px;
}

.JJ {
  position: absolute;
  right: 10px;
  top: 0;
  width: 120px;
}

.JNPF-preview-main .main {
  padding-top: 0;
}



.indfo ::v-deep .el-collapse-item__header {
  display: none;
}

.orderNo ::v-deep .el-descriptions-item__label,
.orderNo ::v-deep .el-descriptions-item__content {
  font-size: 20px;
  font-weight: bold;
}

::v-deep .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 4px 0 0;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px 0 0 0;
}

::v-deep .el-radio-button__inner {
  border-bottom: 0;
}

.tableContainer {
  padding: 5px
}

::v-deep .el-collapse-item {
  border-bottom: 1px solid rgb(220, 223, 230)
}

.productTable ::v-deep .el-table__body-wrapper {
  height: auto !important;
}

.gantt {
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  border-top: 1px solid #dcdfe6;
  background: #fafafa;
  padding-left: 5px;
  font-weight: 700;
}
::v-deep .gantt_cell_tree{
  border-right: 0.5px solid #e0e0e0;
}
</style>