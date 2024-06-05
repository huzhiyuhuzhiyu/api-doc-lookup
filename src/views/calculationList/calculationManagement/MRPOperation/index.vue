<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center">
      <div class="JNPF-common-layout-main JNPF-flex-main">
        <div class="box">
          <div class="hbuild">
            <div
              style="line-height:44px;font-size:18px;border-bottom:1px solid #dcdfe6;background: #fafafa;padding-left:5px;">
              <h4>待运算计划</h4>
            </div>
            <JNPF-table ref="mrpDataForm" v-loading="detailLoading" :data="leftOrderData" class="dataTable" border hasC
              :hasNO="false" :fixedSelect="true" @selection-change="selectMrpData" >
              <el-table-column prop="planNo" label="计划单号" width="180">
                <template slot-scope="scope">
                  <el-link @click="openOrderDialog(scope.row)" type="primary">
                    {{ scope.row.planNo }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="partnerName" label="客户名称" width="120" />
              <el-table-column prop="workOrderNo" label="工作令号" width="120" />
            </JNPF-table>
            <div class="btn"><el-button size="mini" type="primary" icon="el-icon-plus"
                @click="handleAnalyse()">分析</el-button></div>
          </div>


          <div style="width: 84%;background-color: #fff;" class="rightBox">

            <!-- produce生产 purchase采购  out外协-->

            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="生产需求" name="produce">
                <JNPF-table :partentOrChild="'produce'" @sort-change="sortChange" v-loading="listLoading" :data="produceData" show-summary :summary-method="getSummaries1" highlight-current-row :fixedNO="true"
                  class="dataTable" border ref="listTable" custom-column>
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" fixed="left" min-width="120" sortable="custom" />
                  <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" width="320" sortable="custom" />
                     <el-table-column prop="bomId" label="是否有BOM" min-width="140"  sortable="bomId" >
                      <template slot-scope="scope">
                        <div :style="scope.row.bomId ?'color:#85ce60':'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否' }}</div>
                      </template>
                    </el-table-column>
                  <el-table-column prop="planNo" label="计划单号" width="180" />

                  <el-table-column prop="demandQuantity" label="需求数量" width="120" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.demandQuantity==0||!scope.row.demandQuantity?'backgroundColor:red;color:#fff' : 'color:#000'" class="cell">
                        <el-tooltip class="item" effect="dark" :content="'需求数量不能为0,请检查分析产品的BOM或物料档案信息是否正确'"
                          placement="top" v-if="!scope.row.demandQuantity||scope.row.demandQuantity==0">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.demandQuantity ? scope.row.demandQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="immediatelyBuyFlag" label="立即生产" width="100">
                    <template slot-scope="scope">
                      <div :style="scope.row.immediatelyBuyFlag == 1 ? 'color:red;' : ''">{{
                        scope.row.immediatelyBuyFlag == 1 ? "是" : "否" }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="safeInventory" label="安全库存" width="100">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.safeInventory ? scope.row.safeInventory : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="totalInProcessQuantity" label="总在制数量" width="140" />
                  <el-table-column prop="inProcessQuantity" label="在制数量" width="120" /> -->
                  <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column  label="已占用数量" width="140">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.inventoryQuantity - scope.row.availableQuantity ? (scope.row.inventoryQuantity -
                          scope.row.availableQuantity).toFixed(4) : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="lossNum" label="损耗数量" width="140" sortable="custom" />
                  <el-table-column prop="inTransitUnOccupancyQuantity" label="在制未生产数量" min-width="140">
                    <template slot-scope="scope">
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ?  scope.row.inTransitUnOccupancyQuantity : 0}}</div>
                    </template>
                  </el-table-column>
                  

                  <el-table-column prop="occupancyQuantity" label="当前预占数量" width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div style="backgroundColor:red;color:#fff" class="cell"
                        v-if="scope.row.availableStockFlag && scope.row.danger && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                      <div style="backgroundColor:red;color:#fff" class="cell"
                        v-else-if="scope.row.availableStockFlag && (Number(scope.row.availableQuantity) > Number(scope.row.totaloccquantity))
                          && (Number(scope.row.occupancyQuantity) < (Number(scope.row.demandQuantity) + Number(scope.row.lossNum))) && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                      <!-- 占用！= 可用 and 占用！=最终需求 and 占用+需生产！=最终需求+安全 -->
                      <div style="backgroundColor:red;color:#fff" class="cell" v-else-if="scope.row.availableStockFlag && (Number(scope.row.totaloccquantity) != Number(scope.row.availableQuantity)) && (Number(scope.row.occupancyQuantity) != (Number(scope.row.demandQuantity) + Number(scope.row.lossNum)))
                        && ((Number(scope.row.occupancyQuantity) + Number(scope.row.outputQuantity)) != (Number(scope.row.demandQuantity) + Number(scope.row.lossNum) + (scope.row.safeInventoryFlag ? Number(scope.row.safeInventory) : 0)))
                        && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>


                      <div v-else>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outputQuantity" label="需生产数量" fixed="right" width="160" sortable="custom" />

                  <el-table-column prop="mainUnit" label="单位" width="80" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="120" />

                </JNPF-table>
                <pagination :total="total1" :page.sync="produceForm.pageNum" :limit.sync="produceForm.pageSize"
                  @pagination="getproduceData" >
                <!-- <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">总需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">总损耗数量：{{ totalLossNum }}</span>
                  <span style="font-weight:500;margin-right:10px">当前预占数量：{{ totalOccupancyQuantity
                  }}</span>
                  <span style="font-weight:500;margin-right:10px">需生产数量：{{ totalOutputQuantity }}</span>
                </div> -->
                </pagination>
              </el-tab-pane>
              <el-tab-pane label="采购需求" name="purchase">
                <JNPF-table :partentOrChild="'purchase'" v-loading="listLoading" @sort-change="sortChange" show-summary :summary-method="getSummaries2" :data="purchaseData" highlight-current-row :fixedNO="true"
                  class="dataTable" border ref="listTables" custom-column>
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" fixed="left" min-width="120" sortable="custom" />
                  <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" min-width="160" sortable="custom" />
                  <el-table-column prop="planNo" label="计划单号" width="180" />

                  <el-table-column prop="demandQuantity" label="需求数量" width="120" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.demandQuantity==0||!scope.row.demandQuantity ? 'backgroundColor:red;color:#fff' : 'color:#000'" class="cell">
                        <el-tooltip class="item" effect="dark" :content="'需求数量不能为0,请检查分析产品的BOM或物料档案信息是否正确'"
                          placement="top"  v-if="!scope.row.demandQuantity||scope.row.demandQuantity==0">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.demandQuantity ? scope.row.demandQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="immediatelyBuyFlag" label="立即采购" width="100">
                    <template slot-scope="scope">
                      <div :style="scope.row.immediatelyBuyFlag == 1 ? 'color:red;' : ''">{{
                        scope.row.immediatelyBuyFlag == 1 ? "是" : "否" }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="safeInventory" label="安全库存" width="100" />
                  <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column  label="已占用数量" width="140">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.inventoryQuantity - scope.row.availableQuantity ? (scope.row.inventoryQuantity -
                          scope.row.availableQuantity).toFixed(4) : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="lossNum" label="损耗数量" width="140" sortable="custom" />
                  <el-table-column prop="inTransitUnOccupancyQuantity" label="在制未占用数量" min-width="140">
                    <template slot-scope="scope">
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ?  scope.row.inTransitUnOccupancyQuantity : 0}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="occupancyQuantity" label="当前预占数量" width="150" sortable="custom">
                    <template slot-scope="scope">
                      <div style="backgroundColor:red;color:#fff" class="cell"
                        v-if="scope.row.availableStockFlag && scope.row.danger && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                      <!-- demandQuantity需求数量
                  lossNum损耗数量
                  availableQuantity可用库存数量
                  occupancyQuantity当前预占数量 -->

                      <div style="backgroundColor:red;color:#fff" class="cell"
                        v-else-if="scope.row.availableStockFlag && (Number(scope.row.availableQuantity) < Number(scope.row.totaloccquantity))
                          && (Number(scope.row.occupancyQuantity) < (Number(scope.row.demandQuantity) + Number(scope.row.lossNum))) && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                      <!-- 占用！= 可用 and 占用！=最终需求 and 占用+需生产！=最终需求+安全 -->
                      <div style="backgroundColor:red;color:#fff" class="cell" v-else-if="scope.row.availableStockFlag && (Number(scope.row.totaloccquantity) != Number(scope.row.availableQuantity)) && (Number(scope.row.occupancyQuantity) != (Number(scope.row.demandQuantity) + Number(scope.row.lossNum)))
                        && ((Number(scope.row.occupancyQuantity) + Number(scope.row.outputQuantity)) != (Number(scope.row.demandQuantity) + Number(scope.row.lossNum) + scope.row.safeInventoryFlag ? Number(scope.row.safeInventory) : 0))
                        && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>

                      <div v-else>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outputQuantity" label="需采购数量" fixed="right" width="150" sortable="custom" />

                  <el-table-column prop="mainUnit" label="单位" width="80" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="120" />

                </JNPF-table>
                <pagination :total="total2" :page.sync="purchaseForm.pageNum" :limit.sync="purchaseForm.pageSize"
                  @pagination="getpurchaseDataa" >
                <!-- <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">总需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">总损耗数量：{{ totalLossNum }}</span>
                  <span style="font-weight:500;margin-right:10px">当前预占数量：{{ totalOccupancyQuantity
                  }}</span>
                  <span style="font-weight:500;margin-right:10px">需采购数量：{{ totalOutputQuantity }}</span>
                </div> -->
                </pagination>
              </el-tab-pane>
              <el-tab-pane label="外协需求" name="out">
                <JNPF-table :partentOrChild="'out'" v-loading="listLoading" @sort-change="sortChange" :data="outData" show-summary :summary-method="getSummaries3" highlight-current-row :fixedNO="true"
                  class="dataTable" border ref="listTabless" custom-column>
                  <el-table-column prop="productCode" label="产品编码" min-width="140" />
                  <el-table-column prop="productName" label="产品名称" fixed="left" min-width="120" />
                  <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" min-width="160" />
                  <el-table-column prop="bomId" label="是否有BOM" min-width="140" >
                      <template slot-scope="scope">
                        <div :style="scope.row.bomId ?'color:#85ce60':'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否' }}</div>
                      </template>
                    </el-table-column>
                  <el-table-column prop="planNo" label="计划单号" width="180" />
                 
                    <el-table-column prop="demandQuantity" label="需求数量" width="120" sortable="custom">
                      <template slot-scope="scope">
                        <div :style="scope.row.demandQuantity==0||!scope.row.demandQuantity ? 'backgroundColor:red;color:#fff' : 'color:#000'"
                          class="cell">
                          <el-tooltip class="item" effect="dark" :content="'需求数量不能为0,请检查分析产品的BOM或物料档案信息是否正确'"
                            placement="top" v-if="!scope.row.demandQuantity||scope.row.demandQuantity==0">
                            <i class="el-icon-info"></i>
                          </el-tooltip>
                          {{ scope.row.demandQuantity ? scope.row.demandQuantity : '0' }}
                        </div>
                      </template>
                    </el-table-column>
                  <el-table-column prop="safeInventory" label="安全库存" width="100">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.safeInventory ? scope.row.safeInventory : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="inventoryQuantity" label="库存数量" width="120">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="availableQuantity" label="可用库存数量" width="140">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="已占用数量" width="140">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.inventoryQuantity - scope.row.availableQuantity ? (scope.row.inventoryQuantity -
                          scope.row.availableQuantity).toFixed(4) : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="lossNum" label="损耗数量" width="140" />
                  <el-table-column prop="inTransitUnOccupancyQuantity" label="在制未生产数量" min-width="140">
                    <template slot-scope="scope">
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ?  scope.row.inTransitUnOccupancyQuantity : 0}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="occupancyQuantity" label="当前预占数量" width="120">
                    <template slot-scope="scope">

                      <div style="backgroundColor:red;color:#fff" class="cell"
                        v-if="scope.row.availableStockFlag && scope.row.danger && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                      <div style="backgroundColor:red;color:#fff" class="cell"
                        v-else-if="scope.row.availableStockFlag && (Number(scope.row.availableQuantity) < Number(scope.row.totaloccquantity))
                          && (Number(scope.row.occupancyQuantity) < (Number(scope.row.demandQuantity) + Number(scope.row.lossNum))) && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                      <!-- 占用！= 可用 and 占用！=最终需求 and 占用+需生产！=最终需求+安全 -->
                      <div style="backgroundColor:red;color:#fff" class="cell" v-else-if="scope.row.availableStockFlag && (Number(scope.row.totaloccquantity) != Number(scope.row.availableQuantity)) && (Number(scope.row.occupancyQuantity) != (Number(scope.row.demandQuantity) + Number(scope.row.lossNum)))
                        && ((Number(scope.row.occupancyQuantity) + Number(scope.row.outputQuantity)) != (Number(scope.row.demandQuantity) + Number(scope.row.lossNum) + scope.row.safeInventoryFlag ? Number(scope.row.safeInventory) : 0))
                        && !scope.row.mainProductFlag">
                        <el-tooltip class="item" effect="dark" :content="'可用库存数量发生变化并且小于当前占用数量，请重新分析！'" placement="top">
                          <i class="el-icon-info"></i>
                        </el-tooltip>
                        {{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>

                      <div v-else>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : '0' }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outputQuantity" label="需外协数量" fixed="right" width="120" />

                  <el-table-column prop="mainUnit" label="单位" width="80" />
                  <el-table-column prop="deliveryDate" label="交货日期" width="120" />

                </JNPF-table>
                <pagination :total="total3" :page.sync="outForm.pageNum" :limit.sync="outForm.pageSize"
                  @pagination="getouteData" >
                <!-- <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">总需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">总损耗数量：{{ totalLossNum }}</span>
                  <span style="font-weight:500;margin-right:10px">当前预占数量：{{ totalOccupancyQuantity
                  }}</span>
                  <span style="font-weight:500;margin-right:10px">需外协数量：{{ totalOutputQuantity }}</span>
                </div> -->
                </pagination>
              </el-tab-pane>
            </el-tabs>
            <div class="rbtn">
              <el-button size="mini" type="primary" icon="el-icon-download" @click="exportForm()">导出</el-button>
              <el-button size="mini" :loading="btnLoading" type="primary" @click="submitData()">提交数据</el-button>
              <el-button size="mini" type="danger" @click="clearData()">清空分析</el-button>
            </div>
          </div>
        </div>



      </div>
    </div>
    <el-dialog title="运算条件" :close-on-click-modal="false" append-to-body :visible.sync="analyseDialog"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll width="400px">
      <el-row :gutter="15" class="">
        <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="top">
          <el-row :gutter="30" class="custom-row">
            <el-col :sm="24" :xs="24">
              <el-form-item prop="availableStockFlag">
                <el-checkbox v-model="dataForm.availableStockFlag" disabled>可用库存是否参与运算</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :sm="24" :xs="24">

              <el-form-item prop="safeInventoryFlag">
                <el-checkbox v-model="dataForm.safeInventoryFlag" disabled>安全库存是否参与运算</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="analyseDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">{{ $t('common.submitButton')
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="dialogTitle" :close-on-click-modal="false" append-to-body :visible.sync="orderDialog"
      class="JNPF-dialog JNPF-dialog_center" lock-scroll width="1000px">
      <TableForm-product :value="planListDetail" ref="sleeveForm" :tableItems="sleeveItems" :openMode="openMode"
        customStyle height="200" />

      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialog = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" @click="orderDialog = false" :loading="btnLoading">确定</el-button>
      </span>
    </el-dialog>
    <ExportForm v-if="exportFormVisible" ref="exportForm" @download="download" />
  </div>
</template>

<script>
import { getMRPMaterialList, analyseMRP, getMRPInfo, submitMRP, clearMRPList } from '@/api/calculationList/MRPOperation'
import { getPlanList, detailPlanList } from '@/api/calculationList/calculationList'
import TableFormProduct from './TableForm-product/index' // 产品选择组件
import { log } from 'mathjs'
import ExportForm from '@/components/no_mount/ExportBox/index'
import { excelExport } from '@/api/basicData/index'
export default {
  components: { TableFormProduct ,ExportForm},
  data() {
    return {
      exportFormVisible: false,
      btnLoading: false,
      total3: 0,
      total2: 0,
      total1: 0,
      produceForm: {
        documentStatus: "draft",
        demandType: "produce",
        pageSize: 20,
        pageNum: 1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "productName"
        }],
      },
      purchaseForm: {
        documentStatus: "draft",
        demandType: "purchase",
        pageSize: 20,
        pageNum: 1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "productName"
        }],
      },
      outForm: {
        documentStatus: "draft",
        demandType: "out",
        pageSize: 20,
        pageNum: 1,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "productName"
        }],
      },
      openMode: "只读",
      sleeveItems: [

        { prop: "productCode", label: "产品编码", value: "", type: 'view', width: "180", fixed: "" },
        { prop: "productName", label: "产品名称", value: "", type: 'view', width: "180", },
        { prop: "productDrawingNo", label: "产品图号", value: "", type: 'view', width: "400", },
        { prop: "productSourceName", label: "产品来源", value: "", type: 'view', width: "180", },
        { prop: "bomName", label: "BOM名称", value: "", type: 'view', width: "180", },
        { prop: "routingName", label: "工艺路线名称", value: "", type: 'view', width: "180", },
        { prop: "finalPlanQuantity", label: "最终计划数量", value: "", type: 'view', width: "180", },
        { prop: "mainUnit", label: "单位", value: "", type: 'view', width: "80", },
        { prop: "deliveryDate", label: "交货日期", value: "", type: 'view', width: "200" },
        { prop: "remark", label: "备注", value: "", type: 'view', maxlength: 200, width: "180" },



      ],
      planListDetail: [],
      orderDialog: false,
      produceData: [],
      purchaseData: [],
      outData: [],
      dataForm: {
        availableStockFlag: true,
        safeInventoryFlag: true,
        documentStatus: 'draft'
      },

      dialogTitle: "计划信息",
      analyseDialog: false,//分析弹窗
      activeName: "produce",
      btnLoading: false,
      leftOrderData: [],
      rightOrderData: [],
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        documentStatus: "submit",
        calcState: "not_calculated",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: -1
      },
      // 右侧列表请求参数
      listQueryTwo: {
        pageNum: 1,
        pageSize: 50
      },
      formVisible: false,
      dataDetail: [],
      detailLoading: false,
      selectedUnitId: undefined,
      lazyLoadFlag: true,
      totalPage: 0,
      planIdList: [],
      selectMrpDatas: []
    }
  },
  created() {
    this.initData()
    this.getproduceData()
    console.log(4);
  },
  computed: {
    // totalDemandQuantity: function () {
    //   var totalNums = 0;
    //   if (this.activeName == 'produce') {
    //     for (var i = 0; i < this.produceData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.produceData[i].demandQuantity])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'purchase') {
    //     for (var i = 0; i < this.purchaseData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.purchaseData[i].demandQuantity])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'out') {
    //     for (var i = 0; i < this.outData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.outData[i].demandQuantity])
    //     }
    //     return totalNums

    //   }

    // },
    // totalLossNum: function () {
    //   var totalNums = 0;
    //   if (this.activeName == 'produce') {
    //     for (var i = 0; i < this.produceData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.produceData[i].lossNum])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'purchase') {
    //     for (var i = 0; i < this.purchaseData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.purchaseData[i].lossNum])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'out') {
    //     for (var i = 0; i < this.outData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.outData[i].lossNum])
    //     }
    //     return totalNums

    //   }

    // },
    // totalOccupancyQuantity: function () {
    //   var totalNums = 0;
    //   if (this.activeName == 'produce') {
    //     for (var i = 0; i < this.produceData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.produceData[i].occupancyQuantity])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'purchase') {
    //     for (var i = 0; i < this.purchaseData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.purchaseData[i].occupancyQuantity])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'out') {
    //     for (var i = 0; i < this.outData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.outData[i].occupancyQuantity])
    //     }
    //     return totalNums

    //   }

    // },

    // totalOutputQuantity: function () {
    //   var totalNums = 0;
    //   if (this.activeName == 'produce') {
    //     for (var i = 0; i < this.produceData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.produceData[i].outputQuantity])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'purchase') {
    //     for (var i = 0; i < this.purchaseData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.purchaseData[i].outputQuantity])
    //     }
    //     return totalNums

    //   } else if (this.activeName == 'out') {
    //     for (var i = 0; i < this.outData.length; i++) {
    //       totalNums = this.jnpf.math('add', [totalNums, this.outData[i].outputQuantity])
    //     }
    //     return totalNums

    //   }

    // },

  },
  mounted() {

    // document.getElementsByClassName('el-table__body-wrapper')[1].onscroll = (event) => {
    //   const tableWrapper = event.target;
    //   const isBottom = tableWrapper.scrollHeight - tableWrapper.scrollTop === tableWrapper.clientHeight;
    //   console.log(tableWrapper.scrollTop);
    //   if (isBottom && this.lazyLoadFlag) {
    //     this.lazyLoadFlag = false;
    //     this.listQuery.pageNum++
    //     // this.$message.success('滚动到底了')
    //     getPlanList(this.listQuery).then(res => {
    //       this.leftOrderData.push(...res.data.records || [])
    //       this.lazyLoadFlag = true
    //     }).catch(err => { this.lazyLoadFlag = true })
    //   }
    // }
  },
  methods: {
       // 合计处理
       getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1||index === 3||index === 4||index === 7||index === 8||index === 9||index === 10||index === 11) {
          sums[index] = '';
          return;
        }
        const values = this.produceData.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
          sums[index] = Math.round(sums[index]*1000)/1000;
        } else {
          sums[index] = null;
        }
      });
      console.log("sums",sums);
      return sums;

    },
       // 合计处理
       getSummaries2(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1||index === 3||index === 4||index === 6||index === 7||index === 8||index === 9||index === 10) {
          sums[index] = '';
          return;
        }
        const values = this.purchaseData.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              
              return (prev + curr);
            } else {
              return prev;
            }
          });
          // sums[index] += '';
          sums[index] = Math.round(sums[index]*1000)/1000;
        } else {
          sums[index] = null;
        }
      });
      
      return sums

    },
       // 合计处理
       getSummaries3(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '';
          return;
        }
        const values = this.outData.map(item => item[column.property] ? Number(item[column.property]) : '');
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          });
          // sums[index] += '';
          sums[index] = Math.round(sums[index]*1000)/1000;
        } else {
          sums[index] = null;
        }
      });
      return sums;

    },









    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productCode' || prop === 'productName' || prop === 'productDrawingNo' ||
        prop === 'inventoryQuantity' || prop === 'availableQuantity'
      ) {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());

      }
      if (this.activeName == 'produce') {

        this.produceForm.orderItems[0].asc = order === "ascending"
        this.produceForm.orderItems[0].column = order === null ? "" : newProp
        this.getproduceData()

      } else if (this.activeName == 'purchase') {
        this.purchaseForm.orderItems[0].asc = order === "ascending"
        this.purchaseForm.orderItems[0].column = order === null ? "" : newProp
        this.getpurchaseDataa()

      } else if (this.activeName == 'out') {
        this.outForm.orderItems[0].asc = order === "ascending"
        this.outForm.orderItems[0].column = order === null ? "" : newProp
        this.getouteData()

      }
    },
    submitData() {
      if (this.produceData.length < 1 && this.purchaseData.length < 1 && this.outData.length < 1) {
        return this.$message({
          message: "请先分析数据",
          type: "error",
          duration: 1500,
        })
      }
      let flag = null
      if (this.produceData.length > 0) {
        for (let index = 0; index < this.produceData.length; index++) {
          // scope.row.occupancyQuantity < scope.row.demandQuantity&&scope.row.availableQuantity!==scope.row.occupancyQuantity && scope.row.occupancyQuantity !== null
          // 可用库存数量发生变化并且小于当前占用数量，请重新分析！
          const item = this.produceData[index];
          if (!item.demandQuantity||item.demandQuantity=="0") {
            flag = false

            this.$message({
              message: "生产需求数据第" + (index + 1) + "行需求数量不能为0,请检查分析产品的BOM或物料档案信息是否正确",
              type: "error"

            })
            if (this.activeName != "produce") {
              setTimeout(() => {
                this.activeName = "produce"
              }, 1500);
            }
            break
          }
          if(!item.bomId){
            flag = false

            this.$message({
              message: "分析结果中有物料没有BOM，请维护BOM重新分析！",
              type: "error"

            })
            if (this.activeName != "produce") {
              setTimeout(() => {
                this.activeName = "produce"
              }, 1500);
            }
            break
          }
          if (item.danger) {
            flag = false
            this.$message({
              message: "生产需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "produce") {
              setTimeout(() => {
                this.activeName = "produce"
              }, 1500);
            }
            break
          } else if (item.availableStockFlag && (Number(item.availableQuantity) < Number(item.totaloccquantity)) && (Number(item.occupancyQuantity) < (Number(item.demandQuantity) + Number(item.lossNum)))) {
            flag = false
            this.$message({
              message: "生产需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "produce") {
              setTimeout(() => {
                this.activeName = "produce"
              }, 1500);
            }
            break
          }
          else if (item.availableStockFlag && (Number(item.totaloccquantity) != Number(item.availableQuantity)) && (Number(item.occupancyQuantity) != (Number(item.demandQuantity) + Number(item.lossNum)))
            && ((Number(item.occupancyQuantity) + Number(item.outputQuantity)) != (Number(item.demandQuantity) + Number(item.lossNum) + (item.safeInventoryFlag ? Number(item.safeInventory) : 0)))
            && !item.mainProductFlag) {
            flag = false
            this.$message({
              message: "生产需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "produce") {
              setTimeout(() => {
                this.activeName = "produce"
              }, 1500);
            }
            break
          }



        }

      }

      if (this.purchaseData.length > 0) {
        for (let index = 0; index < this.purchaseData.length; index++) {
          // scope.row.occupancyQuantity < scope.row.demandQuantity&&scope.row.availableQuantity!==scope.row.occupancyQuantity && scope.row.occupancyQuantity !== null
          // 可用库存数量发生变化并且小于当前占用数量，请重新分析！
          const item = this.purchaseData[index];
          if (!item.demandQuantity||item.demandQuantity=="0") {
            flag = false

            this.$message({
              message: "采购需求数据第" + (index + 1) + "行需求数量不能为0,请检查分析产品的BOM或物料档案信息是否正确",
              type: "error"

            })
            break
          }
          if (item.danger) {
            flag = false
            this.$message({
              message: "采购需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "purchase") {
              setTimeout(() => {
                this.activeName = "purchase"
              }, 1500);
            }
            break
          } else if (item.availableStockFlag && (Number(item.availableQuantity) < Number(item.totaloccquantity)) && (Number(item.occupancyQuantity) < (Number(item.demandQuantity) + Number(item.lossNum)))) {
            flag = false
            this.$message({
              message: "采购需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "purchase") {
              setTimeout(() => {
                this.activeName = "purchase"
              }, 1500);
            }
            break
          } else if (item.availableStockFlag && (Number(item.totaloccquantity) != Number(item.availableQuantity)) && (Number(item.occupancyQuantity) != (Number(item.demandQuantity) + Number(item.lossNum)))
            && ((Number(item.occupancyQuantity) + Number(item.outputQuantity)) != (Number(item.demandQuantity) + Number(item.lossNum) + (item.safeInventoryFlag ? Number(item.safeInventory) : 0)))
          ) {
            flag = false
            this.$message({
              message: "采购需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "purchase") {
              setTimeout(() => {
                this.activeName = "purchase"
              }, 1500);
            }
            break
          }


        }

      }
      if (this.outData.length > 0) {
        for (let index = 0; index < this.outData.length; index++) {
          // item.occupancyQuantity < item.demandQuantity&&item.availableQuantity!==item.occupancyQuantity && item.occupancyQuantity !== null
          // 可用库存数量发生变化并且小于当前占用数量，请重新分析！
          const item = this.outData[index];
          if (!item.demandQuantity||item.demandQuantity=="0") {
            flag = false

            this.$message({
              message: "外协需求数据第" + (index + 1) + "行需求数量不能为0,请检查分析产品的BOM或物料档案信息是否正确",
              type: "error"

            })
            break
          }
          if(!item.bomId){
            flag = false

            this.$message({
              message: "分析结果中有物料没有BOM，请维护BOM重新分析！",
              type: "error"
            
            })
            if (this.activeName != "out") {
              setTimeout(() => {
                this.activeName = "out"
              }, 1500);
            }
            break
          }
          if (item.danger) {
            flag = false
            this.$message({
              message: "外协需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "out") {
              setTimeout(() => {
                this.activeName = "out"
              }, 1500);
            }
            break
          } else if (item.availableStockFlag && (Number(item.availableQuantity) < Number(item.totaloccquantity)) && (Number(item.occupancyQuantity) < (Number(item.demandQuantity) + Number(item.lossNum)))) {
            flag = false
            this.$message({
              message: "外协需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })
            if (this.activeName != "out") {
              setTimeout(() => {
                this.activeName = "out"
              }, 1500);
            }
            break
          } else if (item.availableStockFlag && (Number(item.totaloccquantity) != Number(item.availableQuantity)) && (Number(item.occupancyQuantity) != (Number(item.demandQuantity) + Number(item.lossNum)))
            && ((Number(item.occupancyQuantity) + Number(item.outputQuantity)) != (Number(item.demandQuantity) + Number(item.lossNum) + (item.safeInventoryFlag ? Number(item.safeInventory) : 0)))
          ) {
            flag = false
            this.$message({
              message: "外协需求数据第" + (index + 1) + "行可用库存数量发生变化并且小于当前占用数量，请重新分析！",
              type: "error"

            })

            if (this.activeName != "out") {
              setTimeout(() => {
                this.activeName = "out"
              }, 1500);
            }
            break
          }

        }
      }
      if (flag === false) return
      this.btnLoading = true
      submitMRP().then(res => {
        this.btnLoading = false
        this.clearData()
        this.initData()
        this.$message({
          message: "提交成功",
          type: "success",
          duration: 1500,
        })
      }).catch(error => {
        this.btnLoading = false
      })
    },
    // 待运算计划详情
    openOrderDialog(row) {
      this.orderDialog = true
      detailPlanList(row.id).then(res => {
        if (res.data.planLineList.length) {
          res.data.planLineList.forEach(item => {
            if (item.productSource == "out") {
              item.productSourceName = "外协"
            } else if (item.productSource == "purchase") {
              item.productSourceName = "采购"

            } else {
              item.productSourceName = "生产"

            }
          });
        }
        this.planListDetail = res.data.planLineList
      })
    },
    clearData() {
      if (this.produceData.length < 1 && this.purchaseData.length < 1 && this.outData.length < 1) {
        return this.$message({
          message: "请先分析数据",
          type: "error",
          duration: 1500,
        })
      }
      clearMRPList().then(res => {
        this.getproduceData()
        console.log(3);
        this.getouteData()
        this.getpurchaseDataa()
      })
    },


    // 提交分析
    dataFormSubmit() {
      let obj = {
        arithmetic: this.dataForm,
        planIdList: this.planIdList
      }
      this.btnLoading = true
      console.log("分析数据", obj);
      analyseMRP(obj).then(res => {
        console.log("res==>分析结果", res);
        this.btnLoading = false
        this.$message({
          message: "分析成功",
          type: "success",
          duration: 1500,
        })
        this.analyseDialog = false
        if (this.activeName == "produce") {
          this.getproduceData()
          console.log(1);

        }
        if (this.activeName == "purchase") {
          this.getpurchaseDataa()

        }
        if (this.activeName == "out") {
          this.getouteData()

        }
        this.selectMrpDatas = []

      }).catch((error) => {
        this.btnLoading = false
      })
    },
    getproduceData() {

      getMRPMaterialList(this.produceForm).then(res => {
        let arr = res.data.records;
        if (arr.length > 0) {
          arr.forEach(item => {
            if (!item.availableQuantity) {
              item.availableQuantity = 0
            }
          });
        }
        const occupancyQuantityMap = {};

        for (let i = 0; i < arr.length; i++) {
          const product = arr[i];
          const productsId = product.productsId;
          const occupancyQuantity = parseFloat(product.occupancyQuantity) || 0;

          if (occupancyQuantityMap.hasOwnProperty(productsId)) {
            occupancyQuantityMap[productsId] += occupancyQuantity;
          } else {
            occupancyQuantityMap[productsId] = occupancyQuantity;
          }
        }

        for (let i = 0; i < arr.length; i++) {
          const product = arr[i];
          const productsId = product.productsId;
          const occupancyQuantity = parseFloat(product.occupancyQuantity) || 0;
          const availableQuantity = parseFloat(product.availableQuantity) || 0;

          if (occupancyQuantityMap[productsId] <= availableQuantity) {
            product.danger = false;
          } else {
            product.danger = true;

          }
          product.totaloccquantity = occupancyQuantityMap[productsId]
        }
        console.log("arr===>", arr);
        this.produceData = arr
        this.$refs.mrpDataForm.$children[0].clearSelection();
        console.log("this.produceData", this.produceData);
        this.total1 = res.data.total
      })
    },
    getpurchaseDataa() {
      getMRPMaterialList(this.purchaseForm).then(res => {
        console.log("右侧列表采购数据",);
        let arr = res.data.records;
        if (arr.length > 0) {
          arr.forEach(item => {
            if (!item.availableQuantity) {
              item.availableQuantity = 0
            }


          });
        }
        const occupancyQuantityMap = {};

        for (let i = 0; i < arr.length; i++) {
          const product = arr[i];
          const productsId = product.productsId;
          const occupancyQuantity = parseFloat(product.occupancyQuantity) || 0;

          if (occupancyQuantityMap.hasOwnProperty(productsId)) {
            occupancyQuantityMap[productsId] += occupancyQuantity;
          } else {
            occupancyQuantityMap[productsId] = occupancyQuantity;
          }
        }

        for (let i = 0; i < arr.length; i++) {
          const product = arr[i];
          const productsId = product.productsId;
          const occupancyQuantity = parseFloat(product.occupancyQuantity) || 0;
          const availableQuantity = parseFloat(product.availableQuantity) || 0;

          if (occupancyQuantityMap[productsId] <= availableQuantity) {
            product.danger = false;
          } else {
            product.danger = true;

          }
          product.totaloccquantity = occupancyQuantityMap[productsId]
        }
        console.log("arr===>", arr);
        this.purchaseData = arr
        this.total2 = res.data.total

      })
    },
    getouteData() {

      getMRPMaterialList(this.outForm).then(res => {
        console.log("右侧列表外协数据",);
        console.log("右侧列表采购数据",);
        let arr = res.data.records;
        if (arr.length > 0) {
          arr.forEach(item => {
            if (!item.availableQuantity) {
              item.availableQuantity = 0
            }


          });
        }
        const occupancyQuantityMap = {};

        for (let i = 0; i < arr.length; i++) {
          const product = arr[i];
          const productsId = product.productsId;
          const occupancyQuantity = parseFloat(product.occupancyQuantity) || 0;

          if (occupancyQuantityMap.hasOwnProperty(productsId)) {
            occupancyQuantityMap[productsId] += occupancyQuantity;
          } else {
            occupancyQuantityMap[productsId] = occupancyQuantity;
          }
        }

        for (let i = 0; i < arr.length; i++) {
          const product = arr[i];
          const productsId = product.productsId;
          const occupancyQuantity = parseFloat(product.occupancyQuantity) || 0;
          const availableQuantity = parseFloat(product.availableQuantity) || 0;

          if (occupancyQuantityMap[productsId] <= availableQuantity) {
            product.danger = false;
          } else {
            product.danger = true;

          }
          product.totaloccquantity = occupancyQuantityMap[productsId]
        }
        console.log("arr===>", arr);
        this.outData = arr
        this.total3 = res.data.total
      })
    },
    handleAnalyse() {
      if (this.planIdList.length > 0) {
        this.analyseDialog = true

      } else {
        this.$message({
          message: "请选择你要分析的数据",
          type: "error",
          duration: 1500,
        })
      }
    },
    handleClick(val) {
      console.log("选中的表格", val);
      this.activeName = val.name
      if (val.name == 'produce') {
        this.getproduceData()
        console.log(2);

      } else if (val.name == 'purchase') {
        this.getpurchaseDataa()

      } else if (val.name == 'out') {
        this.getouteData()

      }
    },
    // 选择左侧数据
    selectMrpData(val) {
      console.log(val);
      this.selectMrpDatas = val
      this.planIdList = []
      if (val.length > 0) {
        val.forEach(item => {
          this.planIdList.push(item.id)
        });
      }
    },

    initData() {
      this.detailLoading = false
      this.leftOrderData = []
      getPlanList(this.listQuery).then(res => {
        this.leftOrderData = res.data.records || [];
        this.total = res.data.total
        this.listLoading = false
        this.totalPage = res.data.pages
      })
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
  exportType(data,ref){
    if (data.length){
          this.exportFormVisible = true
          let domRef = this.$refs[`${ref}`]
          console.log(domRef);
          let columnList = domRef.columnList.filter(item => !!item.label && !!item.prop)
          columnList = columnList.map(item => { return { label: item.label, prop: item.prop } })
          this.$nextTick(() => { this.$refs.exportForm.init(columnList) })
        }else{
          this.$message({
            message: "暂无数据导出",
            type: "error",
            duration: 1500,
          })
    }
  },
    // 导出
    exportForm(){
      if (this.activeName === 'produce'){
        this.exportType(this.produceData,'listTable')
      }
      if (this.activeName === 'purchase'){
        this.exportType(this.purchaseData,'listTables')
      }
      if (this.activeName === 'out'){
        this.exportType(this.outData,'listTabless')
      }

    },
    download(data) { 
      if (data) {
        this.exportFormVisible = false
        let includeFieldMap = {}
        for (let i = 0; i < data.selectKey.length; i++) {
          includeFieldMap[data.selectKey[i]] = data.selectVal[i];
        } 
        let query = this.activeName === 'produce' ? this.produceForm : this.activeName === 'purchase' ? this.purchaseForm : this.outForm
        let _data = {
          ...query,
          exportType: '1015',
          exportName: this.activeName === 'produce' ? '生产需求' : this.activeName === 'purchase' ? '采购需求' : '外协需求',
          includeFieldMap,
          pageSize: data.dataType == 0 ? this.listQuery.pageSize : -1,
        }
        excelExport(_data).then(res => {
          this.exportFormVisible = false
          if (!res.data.url) return
          this.jnpf.downloadFile(res.data.url)
        }).catch(() => { })
      }
    },

  }
}
</script>
<style scoped lang="scss">
.tableBox {
  flex: auto;
  display: flex;
  position: relative;

  // border: 1px solid #dedede;
  // box-shadow: inset 0 0 0 1px #dedede;
  >.dataTable:first-child {
    flex: 1;
    margin: 0 3px 0 0;
  }

  >.dataTable:last-child {
    flex: 4;
  }
}

.footer {
  flex: auto;
  display: flex;
  position: relative;
  width: 100%;
  text-align: center;

  >.analyse {
    flex: 1;
    margin: 0 3px 0 0;
  }

  >.empty {
    flex: 4;
  }
}

.rightBox {
  .el-tabs {
    height: 100%;

  }
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);

}

::v-deep .el-tab-pane {
  height: 100%;

  .tableContainer {
    height: calc(100% - 95px);
  }
}
</style>
<style scoped>
::v-deep .el-tabs__header {
  margin-bottom: 5px;
  padding: 0 10px;
}

.JNPF-common-search-box {
  padding: 8px 0 0 0;
  margin-left: 0 !important;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 8px !important;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding: 0;
}

::v-deep.el-tree-node__content {
  height: 30px;
  line-height: 30px;
}

.JNPF-common-el-tree {
  margin: 5px 0;
}

.el-tabs__nav-scroll {
  padding-left: 0;
}

.analyse {
  padding: 10px;
}

.hbuild {

  width: 16%;
  display: inline-block;
  margin-right: 5px;
}

.box {
  display: flex;
  background-color: #ebeef5;
  height: 100%;
}

.tableContainer {
  height: calc(100% - 111px);
}

.btn {
  background-color: #fff;
  padding: 0px 10px 5px;
  text-align: center;
  height: 66px;
  line-height: 66px;
}

.rbtn {
  position: absolute;
  right: 10px;
  top: 3px;
}

.custom-row {
  margin-top: 18px;
}
.el-tab-pane .tableContainer{
  height: calc(100% - 45px);
}
</style>