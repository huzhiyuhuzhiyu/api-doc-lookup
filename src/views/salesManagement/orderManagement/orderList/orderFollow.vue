<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header noButtons">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" content="订单跟踪" />
      </div>
      <div class="main" v-loading="formLoading">
        <div style="margin-bottom:10px">    
            <el-button type="primary" @click="changeOrder" >切换订单</el-button>
            <el-button type="primary" @click="orderFollow" :style="titleFlag==2?'background-color:#FFF;border: 1px solid #DCDFE6;color:#606266':''">订单跟踪</el-button>
            <el-button  @click="productFollow"  :style="titleFlag==2?'background:#1890ff;border-color:#1890ff;color:#fff':''">产品跟踪</el-button>
        </div>
        <div class=" JNPF-flex-main">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="订单信息" name="orderInfo" >
                <el-form ref="orderDataForm" :model="orderDataForm"  label-width="100px" >
                    <el-row :gutter="30" class="custom-row">
                        <el-col :sm="8" :xs="24">
                          <el-form-item label="客户编码：" prop="cooperativePartnerCode">
                            <!-- <el-input v-model="orderDataForm.cooperativePartnerCode" placeholder="请输入订单编号" readonly  /> -->
                            <div class="label_t">{{orderDataForm.cooperativePartnerCode}}</div>

                          </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24">
                            <el-form-item label="客户名称：" prop="cooperativePartnerName">
                                <!-- <el-input v-model="orderDataForm.cooperativePartnerName" placeholder="请输入订单编号" readonly  /> -->
                                <div class="label_t">{{orderDataForm.cooperativePartnerName}}</div>
                            
                            </el-form-item> 
                        </el-col>
                        
                        <el-col :sm="8" :xs="24" >
                          <el-form-item label="订单号：" prop="orderNo">
                            <!-- <el-input v-model="orderDataForm.orderNo" placeholder="请输入订单编号" readonly  /> -->
                            <div class="label_t">{{orderDataForm.orderNo}}</div>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" >
                          <el-form-item label="工作令号：" prop="workOrderNo">
                            <!-- <el-input v-model="orderDataForm.workOrderNo" placeholder="请输入订单编号" readonly  /> -->
                            <div class="label_t">{{orderDataForm.workOrderNo}}</div>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" >
                          <el-form-item label="订单日期：" prop="orderDate">
                            <!-- <el-input v-model="orderDataForm.orderDate" placeholder="请输入订单编号" readonly  /> -->
                            <div class="label_t">{{orderDataForm.orderDate}}</div>
                          </el-form-item>
                        </el-col>
                        <el-col :sm="8" :xs="24" >
                          <el-form-item label="订单类型：" prop="orderType">
                            <div class="label_t" v-for="(item,index) in orderTypeList" :key="index">{{orderDataForm.orderType==item.value?item.label:""}}</div> 
                 
                          
                          </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                
            </el-collapse-item>
            <el-collapse-item   name="productInfo">
              <template slot="title">
                <span>产品信息</span>
                <div class="status"  style="margin-left:10px;background:#00b050;right:120px">已完成</div>
                <div class="status"  >进行中</div>
              </template>
                <JNPF-table :highlight-current-row="false" v-if="titleFlag==1" :cell-style="tableCellStyle" ref="dataTable" v-loading="listLoading" :data="orderDataFormLine" :fixedNO="true" >
                    <el-table-column prop="customerProductNo" label="客户物料号" min-width="200"   />
                    <el-table-column prop="customerProductDrawingNo" label="客户产品图号" min-width="200" >
                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="200"  />
                    <el-table-column prop="productName" label="产品名称" min-width="200"  >
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="产品图号" min-width="200"   />
                    <el-table-column prop="mainUnit" label="单位(主)" min-width="100"   />
                    <el-table-column prop="num" label="数量"   min-width="100" >  </el-table-column>
                    <el-table-column prop="distributionFlag" label="分配" min-width="100"    >
                        
                    </el-table-column>
                    <el-table-column prop="planSchFlag" label="计划" min-width="100"   >
                    </el-table-column>
                    <el-table-column prop="mrpFlag" label="MRP运算" min-width="100"     > 
                    </el-table-column>
                    <el-table-column prop="pickingFlag" label="领料" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="productionFlag" label="生产" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="warehousingFlag" label="入库" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="deliveryFlag" label="发货" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="reconciliationFlag" label="对账收款" min-width="100"   >
                    </el-table-column>
              </JNPF-table>
              <JNPF-table :highlight-current-row="false" v-if="titleFlag==2" :cell-style="tableCellStyle" ref="dataTables" v-loading="listLoading" :data="orderDataFormLine" :fixedNO="true" :row-class-name="tableRowClassName"  :row-style="selectedHighlight"
                @row-click="rowClick">
                    <el-table-column prop="customerProductNo" label="客户物料号" min-width="200"   />
                    <el-table-column prop="customerProductDrawingNo" label="客户产品图号" min-width="200" >
                    </el-table-column>
                    <el-table-column prop="productCode" label="产品编码" min-width="200"  />
                    <el-table-column prop="productName" label="产品名称" min-width="200"  >
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="产品图号" min-width="200"   />
                    <el-table-column prop="mainUnit" label="单位(主)" min-width="100"   />
                    <el-table-column prop="num" label="数量"   min-width="100" >  </el-table-column>
                    <el-table-column prop="distributionFlag" label="分配" min-width="100"    >
                        
                    </el-table-column>
                    <el-table-column prop="planSchFlag" label="计划" min-width="100"   >
                    </el-table-column>
                    <el-table-column prop="mrpFlag" label="MRP运算" min-width="100"     > 
                    </el-table-column>
                    <el-table-column prop="pickingFlag" label="领料" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="productionFlag" label="生产" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="warehousingFlag" label="入库" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="deliveryFlag" label="发货" min-width="100"    >
                    </el-table-column>
                    <el-table-column prop="reconciliationFlag" label="对账收款" min-width="100"   >
                    </el-table-column>
              </JNPF-table>
            </el-collapse-item>
            <el-collapse-item title="阶段信息" name="stageOnfo">
                <el-tabs v-model="activeName"  @tab-click="handleClick" class="stafeOnfo">
                  <el-tab-pane label="分配" name="distribution">
                    <JNPF-table ref="distributionREF" v-loading="listLoading" :data="distributionData" :fixedNO="true">
                        <el-table-column prop="customerProductNo" label="客户物料号"    />
                        <el-table-column prop="customerProductDrawingNo" label="客户产品图号" >
                          
                        </el-table-column>
                        <el-table-column prop="productCode" label="产品编码"    />
                        <el-table-column prop="productName" label="产品名称"    />
                        <el-table-column prop="drawingNo" label="产品图号"  />
                        <el-table-column prop="mainUnit" label="单位"  />
                        <el-table-column prop="num" label="数量"  />
                        <el-table-column prop="utilizationQuantity" label="利用库存量"  />
                        <el-table-column prop="productionQuantity" label="需生产数量"   />
                        <el-table-column prop="purchaseQuantity" label="需采购数量"   />
                        <el-table-column prop="outsourcingQuantity" label="需外协数量"   />
                      </JNPF-table>
                 
                              <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getsaleOrderLineListFun"  />
                  </el-tab-pane>
                  <el-tab-pane label="计划" name="plan">
                    <JNPF-table ref="planREF" v-loading="listLoading" :data="planData" :fixedNO="true">
                        <el-table-column prop="planNo" label="计划单号"   />
                        <el-table-column prop="originNo" label="来源单号"  >
                            
                        </el-table-column>
                        <el-table-column prop="workOrderNo" label="工作令号"    />
                        <el-table-column prop="calcState" label="运算状态" >
                          <template slot-scope="scope">
                            <div v-if="scope.row.calcState == 'not_calculated'"><el-tag type="warning">未运算</el-tag> </div>
                            <div v-if="scope.row.calcState == 'calculated'"><el-tag type="success">已运算</el-tag></div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" />
                        <el-table-column prop="createByName" label="创建人" />
                        <el-table-column prop="remark" label="备注" />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'plan','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                       
                             
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getPlanListFun"  />
                  </el-tab-pane>
                  
                  <el-tab-pane label="MRP运算" name="mrp">
                    <el-tabs v-model="mrpactiveName" @tab-click="handleMRPClick">
                        <el-tab-pane label="生产需求" name="mrpproduce">
                            <JNPF-table  :data="produceData" highlight-current-row
                              class="dataTables" border ref="MRPlistTable">
                              <el-table-column prop="productCode" label="产品编码"   width="140"/>
                              <el-table-column prop="productName" label="产品名称"    width="180"/>
                              <el-table-column prop="productDrawingNo" label="产品图号"  min-width="470"  />
                                 <el-table-column prop="bomFlagText" label="是否有BOM"  width="130">
                                  <template slot-scope="scope">
                                    <div :style="scope.row.bomId ?'color:#85ce60':'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否' }}</div>
                                  </template>
                                </el-table-column>
                              <el-table-column prop="planNo" label="计划单号"  width="180"/>
                              <el-table-column prop="demandQuantity" label="需求数量"  width="100">
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
                              <el-table-column prop="safeInventory" label="安全库存" width="100">
                                <template slot-scope="scope">
                                  <div> {{ scope.row.safeInventory ? scope.row.safeInventory : '0' }} </div>
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
                              <el-table-column prop="lossNum" label="损耗数量" width="140"  />                 
                              <el-table-column prop="inTransitUnOccupancyQuantity" label="在制未占用数量" width="170"  />
                              <el-table-column prop="occupancyQuantity" label="当前预占数量"  width="180">
                                <template slot-scope="scope">
                                    <div >{{ scope.row.inTransitOccupancyQuantity? Number(scope.row.inTransitOccupancyQuantity)+Number(scope.row.occupancyQuantity):scope.row.occupancyQuantity?scope.row.occupancyQuantity:'0' }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="outputQuantity" label="需生产数量" fixed="right"  width="150" />
                              <el-table-column prop="mainUnit" label="单位" width="80" />
                              <el-table-column prop="deliveryDate" label="交货日期"  min-width="160"/>
                              <el-table-column label="操作" width="200" fixed="right">
                                <template slot-scope="scope">
                                  <el-button size="mini" type="text" :disabled=" scope.row.outputQuantity == 0 || scope.row.mainProductFlag" @click.native="retrospectFun(scope.row.id, 'produce')">追溯主产品</el-button>
                                  <el-button size="mini" type="text"  @click.native="complateSetFun(scope.row.id, 'produce')" >齐套查询</el-button>
                                </template>
                              </el-table-column>
                            </JNPF-table>
                            <pagination :total="total1" :page.sync="produceForm.pageNum" :limit.sync="produceForm.pageSize"
                              @pagination="getproduceData" />
                         
                        </el-tab-pane>
                        <el-tab-pane label="采购需求" name="mrppurchase">
                            <JNPF-table v-loading="listLoading"  :data="purchaseDataMRP" highlight-current-row
                              class="dataTabless" border ref="MRPlistTables">
                              <el-table-column prop="productCode" label="产品编码"   width="140"/>
                              <el-table-column prop="productName" label="产品名称"    width="180"/>
                              <el-table-column prop="productDrawingNo" label="产品图号"  min-width="470"  />
                              <el-table-column prop="planNo" label="计划单号"  width="180"/>
                              <el-table-column prop="demandQuantity" label="需求数量"  width="100">
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
                              <el-table-column prop="safeInventory" label="安全库存"  width="100"/>
                              <!-- <el-table-column prop="inventoryQuantity" label="库存数量"  width="100">
                                <template slot-scope="scope">
                                  <div>
                                    {{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : '0' }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="availableQuantity" label="可用库存数量"  width="140">
                                <template slot-scope="scope">
                                  
                                  <div >{{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                                  </div>
                                </template>
                              </el-table-column> -->
                              <el-table-column prop="lossNum" label="已占用数量" width="120">
                                <template slot-scope="scope">
                                  <div>
                                    {{ scope.row.inventoryQuantity - scope.row.availableQuantity ? (scope.row.inventoryQuantity -
                                      scope.row.availableQuantity).toFixed(4) : 0 }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="lossNum" label="损耗数量" width="120"  />
                              <el-table-column prop="inTransitUnOccupancyQuantity" label="在途未占用数量" width="150" />
                              <el-table-column prop="occupancyQuantity" label="当前预占数量" width="160">
                                <template slot-scope="scope">
                                  <div >{{ scope.row.inTransitOccupancyQuantity? Number(scope.row.inTransitOccupancyQuantity)+Number(scope.row.occupancyQuantity):scope.row.occupancyQuantity?scope.row.occupancyQuantity:'0' }}
                                  </div> 
                                </template>
                              </el-table-column>
                              <el-table-column prop="outputQuantity" label="需采购数量" fixed="right"  width="120"/>
                              <el-table-column prop="mainUnit" label="单位" width="80" />
                              <el-table-column prop="deliveryDate" label="交货日期"  width="140"/>
                              <el-table-column label="操作" width="120" fixed="right">
                                <template slot-scope="scope">
                                  <el-button size="mini" type="text" :disabled=" scope.row.outputQuantity == 0 || scope.row.mainProductFlag" @click.native="retrospectFun(scope.row.id, 'purchase')">追溯主产品</el-button>
                                </template>
                              </el-table-column>
                            </JNPF-table>
                            <pagination :total="total2" :page.sync="purchaseForm.pageNum" :limit.sync="purchaseForm.pageSize"
                              @pagination="getpurchaseDataa" />
                            <!-- <div style="height: 40px; line-height: 40px; background: #f5f7fa;text-align:end" class="text">
                              <span style="font-weight:500;margin-right:10px">总需求数量：{{ totalDemandQuantity }}</span>
                              <span style="font-weight:500;margin-right:10px">总损耗数量：{{ totalLossNum }}</span>
                              <span style="font-weight:500;margin-right:10px">当前预占数量：{{ totalOccupancyQuantity
                              }}</span>
                              <span style="font-weight:500;margin-right:10px">需采购数量：{{ totalOutputQuantity }}</span>
                            </div> -->
                        </el-tab-pane>
                        <el-tab-pane label="外协需求" name="mrpout">
                            <JNPF-table v-loading="listLoading"   :data="outData" highlight-current-row
                              class="dataTablesss" border ref="listTabless">
                              <el-table-column prop="productCode" label="产品编码"  width="140"/>
                              <el-table-column prop="productName" label="产品名称"   width="180"/>
                              <el-table-column prop="productDrawingNo" label="产品图号"  min-width="470"   />
                              <el-table-column prop="bomFlagText" label="是否有BOM"  width="180">
                                  <template slot-scope="scope">
                                    <div :style="scope.row.bomId ?'color:#85ce60':'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否' }}</div>
                                  </template>
                                </el-table-column>
                              <el-table-column prop="planNo" label="计划单号" width="180" />
                                <el-table-column prop="demandQuantity" label="需求数量"  width="100">
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
                              <!-- <el-table-column prop="inventoryQuantity" label="库存数量" width="100">
                                <template slot-scope="scope">
                                  <div>
                                    {{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : '0' }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="availableQuantity" label="可用库存数量" width="140">
                                <template slot-scope="scope">
                                  <div>{{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                                  </div>
                                </template>
                              </el-table-column> -->
                              <el-table-column prop="lossNum" label="已占用数量" width="140">
                                <template slot-scope="scope">
                                  <div>
                                    {{ scope.row.inventoryQuantity - scope.row.availableQuantity ? (scope.row.inventoryQuantity -
                                      scope.row.availableQuantity).toFixed(4) : 0 }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="lossNum" label="损耗数量" width="140" />
                              <el-table-column prop="inTransitUnOccupancyQuantity" label="在途未占用数量" width="170" />
                              <el-table-column prop="occupancyQuantity" label="当前预占数量"  width="150">
                                <template slot-scope="scope">
                                  <div >{{ scope.row.inTransitOccupancyQuantity? Number(scope.row.inTransitOccupancyQuantity)+Number(scope.row.occupancyQuantity):scope.row.occupancyQuantity?scope.row.occupancyQuantity:'0' }}
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column prop="outputQuantity" label="需外协数量" fixed="right"   width="120"/>
                              <el-table-column prop="mainUnit" label="单位" width="80" />
                              <el-table-column prop="deliveryDate" label="交货日期"   width="160"/>
                              <el-table-column label="操作" width="200" fixed="right">
                                <template slot-scope="scope">
                                  <el-button size="mini" type="text" :disabled=" scope.row.outputQuantity == 0 || scope.row.mainProductFlag" @click.native="retrospectFun(scope.row.id, 'out')">追溯主产品</el-button>
                                  <el-button size="mini" type="text"  @click.native="complateSetFun(scope.row.id, 'out')" >齐套查询</el-button>
                                </template>
                              </el-table-column>
                            </JNPF-table>
                            <pagination :total="total3" :page.sync="outForm.pageNum" :limit.sync="outForm.pageSize"
                              @pagination="getouteData" />
                            <!-- <div style="height: 40px; line-height: 40px; background: #f5f7fa;text-align:end" class="text">
                              <span style="font-weight:500;margin-right:10px">总需求数量：{{ totalDemandQuantity }}</span>
                              <span style="font-weight:500;margin-right:10px">总损耗数量：{{ totalLossNum }}</span>
                              <span style="font-weight:500;margin-right:10px">当前预占数量：{{ totalOccupancyQuantity
                              }}</span>
                              <span style="font-weight:500;margin-right:10px">需外协数量：{{ totalOutputQuantity }}</span>
                            </div> -->
                        </el-tab-pane>
                    </el-tabs>
                  </el-tab-pane>
                  <el-tab-pane label="采购" name="purchase">
                    <JNPF-table ref="purchaseREF" v-loading="listLoading" :data="purchaseData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="采购单号"    />
                        <el-table-column prop="cooperativePartnerCode" label="供应商编码" >
                           
                        </el-table-column>
                        <el-table-column prop="cooperativePartnerName" label="供应商名称"    />
                        <el-table-column prop="receivingStatus" label="收货状态" align="center"  
                          fixed="right">
                          <template slot-scope="scope">
                            <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                            <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deliveryDate" label="交货日期"  />
                        <el-table-column prop="remark" label="备注"  />
                        <el-table-column prop="createTime" label="创建时间"  />
                        <el-table-column prop="createByName" label="创建人"  />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'purchase','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="purchaseOrderListFun" /> 
                  </el-tab-pane>
                  <el-tab-pane label="领料" name="picking">
                    <JNPF-table ref="pickingREF" v-loading="listLoading" :data="pickingData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="领料单号"   />
                        <el-table-column prop="receiveType" label="领料类型" >
                          <template slot-scope="scope">
                            <div v-if="scope.row.receiveType == 'order'">订单物料
                            </div>
                            <div v-if="scope.row.receiveType == 'process'">工序物料
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="personName" label="领料人"   />
                        <el-table-column prop="operationDate" label="领料日期"   />
                        <el-table-column prop="remark" label="备注" />
                        <el-table-column prop="createTime" label="创建时间" />
                        <el-table-column prop="createByName" label="创建人" />
                        <el-table-column label="操作" fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'picking','look')">查看详情</el-button>
                            
                            
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getWithdrawalListFun"  /> 
                  </el-tab-pane>
                  <el-tab-pane label="产品外协" name="productOut">
                    <JNPF-table ref="productOutREF" v-loading="listLoading" :data="productOutData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="外协单号"    />
                        <el-table-column prop="cooperativePartnerCode" label="外协供应商编码" >
                          
                        </el-table-column>
                        <el-table-column prop="cooperativePartnerName" label="外协供应商名称"   />
                        <el-table-column prop="deliveryDate" label="交货日期"   />
                        <el-table-column prop="remark" label="备注" />
                        <el-table-column prop="receivingStatus" label="收货状态" align="center"   >
                          <template slot-scope="scope">
                            <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                            <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" />
                        <el-table-column prop="createByName" label="创建人" />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'productOut','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getProductOrderListFun"  /> 
                  </el-tab-pane>
                  <el-tab-pane label="生产" name="production">
                    <JNPF-table ref="productionREF" v-loading="listLoading" :data="productionData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="订单号" width="180">
                            
                        </el-table-column>
                        <el-table-column prop="source" label="订单来源" min-width="100">
                          <template slot-scope="scope">
                            <el-link type="primary" @click.native="getOrderSourceList(scope.row.id,)">MRP</el-link>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productCode" label="产品编码"     width="180"/>
                        <el-table-column prop="productName" label="产品名称"   width="180"/>
                        <el-table-column prop="productDrawingNo" label="产品图号"   width="180"/>
                        <el-table-column prop="deliveryDate" label="交货日期"   width="140"/>
                        <el-table-column prop="productionStatus" label="生产状态" width="110"  fixed="right">
                          <template slot-scope="scope">
                            <el-tag type="warning" disable-transitions
                              v-if="scope.row.productionStatus === 'not_started'">未生产</el-tag>
                            <el-tag type="primary" disable-transitions
                              v-if="scope.row.productionStatus === 'start_production'">生产中</el-tag>
                            <el-tag type="success" disable-transitions
                              v-if="scope.row.productionStatus === 'production_completed'">生产完成</el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="orderStatus" label="订单状态" width="110"  fixed="right">
                          <template slot-scope="scope">
                            <el-tag type=" primary" disable-transitions v-if="scope.row.orderStatus === 'normal'">正常</el-tag>
                            <el-tag type="warning" disable-transitions v-if="scope.row.orderStatus === 'suspend'">暂停</el-tag>
                            <el-tag type="danger" disable-transitions v-if="scope.row.orderStatus === 'closed'">关闭</el-tag>
                            <el-tag type="success" disable-transitions v-if="scope.row.orderStatus === 'finish'">已完成</el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="productionQuantity" label="生产数量"   width="120"/>
                        <el-table-column prop="completedQuantity" label="已完成数量"   width="120"/>
                        <el-table-column prop="blankProductsName" label="下料产品"   width="180"/>
                        <el-table-column prop="blankProductsDrawingNo" label="下料图号"   width="180"/>
                        <el-table-column prop="blankingQuantity" label="已下料数"   width="120"/>
                        <el-table-column prop="dispatchedQuantity" label="已派工数"   width="120"/>
                        <el-table-column prop="routingCode" label="工艺路线编码" width="220" ></el-table-column>
                        <el-table-column prop="routingName" label="工艺路线名称"  width="180"></el-table-column>
                        <el-table-column prop="suspendByName" label="暂停人" width="120" ></el-table-column>
                        <el-table-column prop="suspendDate" label="暂停时间" min-width="200"></el-table-column>
                        <el-table-column prop="insertOrderFlag" label="是否插单"   width="100">
                          <template slot-scope="scope">
                            <div v-if="!scope.row.insertOrderFlag">否</div>
                            <div v-if="scope.row.insertOrderFlag">是</div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="insertOrderSort" label="插单顺序"   width="100"/>
                        <el-table-column prop="createTime" label="创建时间"   width="180"/>
                        <el-table-column prop="createByName" label="创建人"   width="100"/>
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'production','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getsaleOrderLineListFun"  /> 
                  </el-tab-pane>
                  <el-tab-pane label="工序外协" name="productionOut">
                    <JNPF-table ref="productionOutREF" v-loading="listLoading" :data="productionOutData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="外协单号"    />
                        <el-table-column prop="cooperativePartnerCode" label="外协供应商编码" >
                            
                        </el-table-column>
                        <el-table-column prop="cooperativePartnerName" label="外协供应商名称"    />
                        <el-table-column prop="deliveryDate" label="交货日期"    />
                        <el-table-column prop="remark" label="备注"  />
                        <el-table-column prop="receivingStatus" label="收货状态" align="center"   >
                          <template slot-scope="scope">
                            <div v-if="scope.row.receivingStatus == 'receiving'"><el-tag>未完成</el-tag> </div>
                            <div v-if="scope.row.receivingStatus == 'received'"><el-tag type="success">已完成</el-tag></div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间"  />
                        <el-table-column prop="createByName" label="创建人"  />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'productionOut','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="wxpurchaseOrderListFun"  /> 
                  </el-tab-pane>
                  <el-tab-pane label="入库" name="warehousing">
               
                    
                    <JNPF-table ref="warehousingREF" v-loading="listLoading" :data="warehousingData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="入库单号"    />
                        <el-table-column prop="sourceType" label="来源类型" >
                          
                        </el-table-column>
                        <el-table-column prop="sourceNo" label="来源单号"    />
                        <el-table-column prop="partnerCode" label="合作伙伴编码"    />
                        <el-table-column prop="partnerName" label="合作伙伴名称"  />
                        <!-- <el-table-column prop="departmentName" label="收货状态"  /> -->
                        <el-table-column prop="createTime" label="创建时间"  />
                        <el-table-column prop="createByName" label="创建人"  />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'warehousing','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getWarehouseListFun"  /> 
                  </el-tab-pane>
                  <el-tab-pane label="发货" name="delivery">
                    <JNPF-table ref="deliveryREF" v-loading="listLoading" :data="deliveryData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="发货通知单号"   width="180" />
                        <el-table-column prop="partnerCode" label="客户编码" width="120">
                         
                        </el-table-column>
                        <el-table-column prop="partnerName" label="客户名称"     width="180" />
                        <el-table-column prop="deliverDate" label="发货日期"     width="180" />
                        <el-table-column prop="recipient" label="收件人"  />
                        <el-table-column prop="phone" label="收件人电话"   width="180" />
                        <el-table-column prop="region.countryName" label="国家"  />
                        <el-table-column prop="region.provinceName" label="省"  />
                        <el-table-column prop="region.cityName" label="市"  />
                        <el-table-column prop="region.areaName" label="区"  />
                        <el-table-column prop="address" label="地址"  />
                        <el-table-column prop="delivery" label="发货方式" width="120">
                          <template slot-scope="scope">
                            <div v-if="scope.row.delivery == 'deliver_goods'">
                              <span>送货</span>
                            </div>
                            <div v-else-if="scope.row.delivery == 'self_pickup'">
                              <span>自提</span>
                            </div>
                            <div v-else-if="scope.row.delivery == 'express_delivery'">
                              <span>快递</span>
                            </div>
                            <div v-else-if="scope.row.delivery == 'freight_transport'">
                              <span>货运</span>
                            </div>
                            <div v-else-if="scope.row.delivery == 'collect_payment'">
                              <span>到付</span>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deliveryStatus" label="发货状态"   fixed="right" align="center" width="120">
                          <template slot-scope="scope">
                            <div v-if="scope.row.deliveryStatus == 'undelivered'">
                              <el-tag type="primary">未完成</el-tag>
                            </div>
                            <div v-else-if="scope.row.deliveryStatus == 'delivered'">
                              <el-tag type="success">已完成</el-tag>
                            </div>
                            <div v-else-if="scope.row.deliveryStatus == 'canceled'">
                              <el-tag type="danger">已取消</el-tag>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column prop="deliveryCompletionDate" label="发货完成日期"   width="180" ></el-table-column>
                        <el-table-column prop="createTime" label="申请日期"   width="180" ></el-table-column>
                        <el-table-column prop="createByName" label="申请人" width="140"  />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'delivery','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getQuotationdatasendlistFun"  /> 
                  </el-tab-pane>
                         
                  <el-tab-pane label="对账收款" name="reconciliation">
                    <JNPF-table ref="reconciliationREF" v-loading="listLoading" :data="reconciliationData" :fixedNO="true">
                        <el-table-column prop="orderNo" label="对账单号"    width="160"/>
                        <el-table-column prop="reconciliationDate" label="对账日期" width="120">
                          
                        </el-table-column>
                        <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="200"  />
                         <el-table-column prop="cooperativePartnerCode" label="客户编码" min-width="200"  />
                        <el-table-column prop="excludingTaxAmount" label="不含税总金额" width="160">
                            <template slot-scope="scope">
                              <div :class="scope.row.excludingTaxAmount > 0 ? 'green' : 'red'">{{ scope.row.excludingTaxAmount > 0 ? '+' + scope.row.excludingTaxAmount : scope.row.excludingTaxAmount }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="taxAmount" label="总税额" >
                            <template slot-scope="scope">
                              <div :class="scope.row.taxAmount > 0 ? 'green' : 'red'">{{ scope.row.taxAmount > 0 ? '+' + scope.row.taxAmount : scope.row.taxAmount }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="includingTaxAmount" label="含税总金额" width="140">
                            <template slot-scope="scope">
                              <div :class="scope.row.includingTaxAmount > 0 ? 'green' : 'red'">{{ scope.row.includingTaxAmount > 0 ? '+' + scope.row.includingTaxAmount : scope.row.includingTaxAmount }}</div>
                            </template>
                        </el-table-column>
                          <el-table-column prop="totalReconciliationAmount" label="对账金额" width="100">
                            <template slot-scope="scope">
                              <div :class="scope.row.totalReconciliationAmount > 0 ? 'green' : 'red'">{{ scope.row.totalReconciliationAmount > 0 ? '+' + scope.row.totalReconciliationAmount : scope.row.totalReconciliationAmount }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="totalPaymentAmount" label="已收款金额" width="140">
                            <template slot-scope="scope">
                              <div :class="scope.row.totalPaymentAmount > 0 ? 'green' : 'red'">{{ scope.row.totalPaymentAmount > 0 ? '+' + scope.row.totalPaymentAmount : scope.row.totalPaymentAmount }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="totalInvoicingAmount" label="已开票金额" width="140">
                            <template slot-scope="scope">
                              <div :class="scope.row.totalInvoicingAmount > 0 ? 'green' : 'red'">{{ scope.row.totalInvoicingAmount > 0 ? '+' + scope.row.totalInvoicingAmount : scope.row.totalInvoicingAmount }}</div>
                            </template>
                          </el-table-column>
                          <el-table-column prop="remark" label="备注"  />
                          <el-table-column prop="createTime" label="创建时间"   width="180"/>
                          <el-table-column prop="createByName" label="创建人" />
                        <el-table-column label="操作"  fixed="right">
                         <template slot-scope="scope">
                           <el-button size="mini" type="text"
                             @click="addOrUpdateHandle(scope.row.id,'reconciliation','look')">查看详情</el-button>
                         
                         </template>
                        </el-table-column>
                      </JNPF-table>
                      <pagination :total="total" :page.sync="pageNum" :limit.sync="pageSize"
                              @pagination="getfinAccountListFun"  /> 
                  </el-tab-pane>
                </el-tabs>
            </el-collapse-item>
 
          </el-collapse>
         
        </div>
      </div>
       <!-- 订单来源明细 -->
    <el-dialog title="订单来源明细" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="sourceDialog" append-to-body
      lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
      <el-row :gutter="20" style="margin :10px 0">
        <el-table ref="workerDialog" v-loading="listLoading" :data="sourceList" border height="400">
          <el-table-column prop="ordersNo" label="销售单号"> </el-table-column>
          <el-table-column prop="planOrderNo" label="计划单号" />
          <el-table-column prop="workOrderNo" label="工作令号" />
          <el-table-column prop="createTime" label="来源时间"></el-table-column>
        </el-table>
      </el-row>
    </el-dialog>

    <!-- 切换订单弹框 -->
    <el-dialog title="选择销售订单" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="orderVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body @close="handleClose">
    
        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
            

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerCode" placeholder="请输入客户编码" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.cooperativePartnerName" placeholder="请输入客户名称" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="orderForm.orderNo" placeholder="请输入订单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item  >
                    <el-date-picker v-model="orderDateArr" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                      :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getAllOrderListFun()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table v-loading="listLoading" :data="allOrderList" :fixedNO="true">

                <el-table-column prop="cooperativePartnerCode" label="客户编码" width="160" />
                <el-table-column prop="cooperativePartnerName" label="客户名称" min-width="200" />
                <el-table-column prop="orderNo" label="订单号" width="160"></el-table-column>
                <el-table-column prop="createTime" label="订单日期" width="180" />
                <el-table-column prop="createByName" label="订单类型" min-width="120" />
                <el-table-column prop="workOrderNo" label="工作令号" width="160"></el-table-column>

                <el-table-column label="操作" >
                  <template slot-scope="scope">
                    <el-button type="text" size="mini"   @click="selectOrder(scope.row)">
                      选择</el-button>
                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="getAllOrderListFun" />
            </div>
          </div>
        </div>

      </el-dialog>
    <PurchaseFormPage v-if="purchaseVisible" ref="Purchaseref" @refresh="refresh" @close="refresh" />
    <PlanFormPage v-if="planVisible" ref="Planref" @refresh="refresh" @close="refresh" />
    <PickingFormPage v-if="pickingVisible" ref="Pickingref" @refresh="refresh" @close="refresh" />
    <ProductOutFormPage v-if="productOutVisible" ref="ProductOutref" @refresh="refresh" @close="refresh" />
    <ProductionFormPage v-if="productionVisible" ref="Productionref" @refresh="refresh" @close="refresh" />
    <ProductionrOutFormPage v-if="productionrOutVisible" ref="ProductionrOutref" @refresh="refresh" @close="refresh" />
    <WarehousingFormPage v-if="warehousingVisible" ref="Warehousingref" @refresh="refresh" @close="refresh" />
    
    <DeliveryFormPage v-if="deliveryVisible" ref="Deliveryref" @refresh="refresh" @close="refresh" />
    <ReconciliationFormPage v-if="reconciliatioVisible" ref="Reconciliationref" @refresh="refresh" @close="refresh" />
    <ComplateSetForm v-if="complateSetFormVisible" ref="complateSetFormref" @refresh="refresh" @close="refresh" />
    <RetrospectForm v-if="retrospectFormVisible" ref="retrospectFormref" @refresh="refresh" @close="refresh" />

    </div>
  </transition>
</template>

  <script>
import { getOrderSourceList } from '@/api/productOrdes/finishedProductOrders'
import PlanFormPage from '../../../calculationList/calculationManagement/calculationManagement/Form.vue'
import PurchaseFormPage from '../../../purchasingManagement/purchaseOrders/purchaseOrder/Form.vue'
import PickingFormPage from '../../../productionOrders/assembleManagement/MaterialRequisitionNotice/Form.vue'
import ProductOutFormPage from '../../../productionOrders/assembleManagement/MaterialRequisitionNotice/Form'
import ProductionFormPage from '../../../productionOrders/productOrdersMan/finishedOrdersManage/Form.vue'
import ProductionrOutFormPage from '../../../externalProcessManagement/externalProcess/outsourProcessOrder/Form.vue'
import DeliveryFormPage from '../../shippingnotice/assemblyNotice/Form.vue'
import WarehousingFormPage from "../../../warehouseManagement/inboundAndOutbound/inbound/Form.vue"
import ReconciliationFormPage from '../../saleReconciliationManagement/salesReconManagement/Form.vue'
import ComplateSetForm from '../../../calculationList/calculationManagement/completeSetQuery/complateSetForm.vue'
import RetrospectForm from '../../../calculationList/calculationManagement/completeSetQuery/retrospectForm.vue'
import { getMRPMaterialList,  } from '@/api/calculationList/MRPOperation'
import {getOrderDetail,getPlanList,purchaseOrderList,WithdrawalList,getprodOrderList,getWarehouseList,getQuotationdatasendlist,getfinAccountList,getsaleOrderList,getsaleOrderLineList} from "@/api/orderFollow/index"
import originTypeList from "../originTypeList.js"
export default {
  props: {},
  components: {PlanFormPage, PurchaseFormPage,PickingFormPage,RetrospectForm,ComplateSetForm, ProductOutFormPage,ProductionFormPage,ProductionrOutFormPage,DeliveryFormPage,ReconciliationFormPage,WarehousingFormPage },
    data() {
        return {
          retrospectFormVisible:false,
          complateSetFormVisible:false,
          planVisible:false,
          purchaseVisible:false,
          pickingVisible:false,
          productOutVisible:false,
          productionVisible:false,
          productionrOutVisible:false,
          deliveryVisible:false,
          reconciliatioVisible:false, 
          warehousingVisible:false,
          pickerOptions: {
        disabledDate(time) {
          // 获取当前日期
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          // 获取6个月前的日期
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          sixMonthsAgo.setHours(0, 0, 0, 0);
          // 如果选择的日期范围超过6个月，或者结束日期不是当前日期，则禁用
          return time.getTime() < sixMonthsAgo || time.getTime() > today;
        }
      },
          orderDateArr:[],
          orderForm:{
            cooperativePartnerCode:"",
            cooperativePartnerName:"",
            orderNo:"",
            orderStartDate:"",
            orderEndDate:"",

            pageSize: 20,
            pageNum: 1,
          },
          allOrderList:[],
          orderVisible:false,
            mrpactiveName:"mrpproduce",
            sourceDialog:false,
            activeName: 'distribution',
            tableData:[],
            listLoading:false,
            orderTypeList: [
                { label: "正常订单", value: "normal" },
                { label: "预测订单", value: "prediction" },
                { label: "样品订单", value: "sample" },
                { label: "备货订单", value: "stock_up" },
                { label: "急件订单", value: "urgent" },
            ],
            formLoading:false,
            activeNames: ["orderInfo",'productInfo','stageOnfo'],
            titleFlag:1,
            orderDataForm:{},
            orderDataFormLine:[],
            sourceList:[],
            originTypeList: originTypeList.inboundList,
            distributionData:[],
            planData:[],
            MRPData:[],
            purchaseData:[],
            pickingData:[],
            productOutData:[],
            productionData:[],
            productionOutData:[],
            warehousingData:[],
            deliveryData:[],
            reconciliationData:[],
            total:0,
            pageSize:20,
            pageNum:1,
            total1:0,
            total2:0,
            total3:0,
            produceData:[],
            purchaseDataMRP:[],
            outData:[], 

            produceForm: {
              documentStatus: "submit",
              demandType: "produce",
              originNo:"",
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
              documentStatus: "submit",
              demandType: "purchase",
              pageSize: 20,
              pageNum: 1,
              originNo:"",
              orderItems: [{
                asc: false,
                column: ""
              }, {
                asc: false,
                column: "productName"
              }],
            },
            outForm: {
              documentStatus: "submit",
              demandType: "out",
              originNo:"",
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
            clickedRow:{},
            getIndex:"",
            currentProductInfo:{}
        };
    },
  created() {
    // this.listQuery = JSON.parse(JSON.stringify(this.initListQuery));
  },
  mounted() {
    
    // this.$nextTick(()=>{
    //   console.log(" this.$refs", this.$refs);
    //   this.$refs.distributionREF.doLayout()
    // })
  },
  methods: { 
 
    complateSetFun(id, type) {
      console.log(id, type);
      this.complateSetFormVisible = true;
      this.$nextTick(() => {
        this.$refs.complateSetFormref.init(id, type);
      });
    },
    retrospectFun(id, type) {
      this.retrospectFormVisible = true;
      this.$nextTick(() => {
        this.$refs.retrospectFormref.init(id, type);
      });
    },




    refresh() {
      this.planVisible=false
      this.purchaseVisible=false
      this.pickingVisible=false
      this.productOutVisible=false
      this.productionVisible=false
      this.productionrOutVisible=false
      this.deliveryVisible=false
      this.reconciliatioVisible=false 
      this.warehousingVisible=false
      this.retrospectFormVisible=false
      this.complateSetFormVisible=false
      
    },
    // 查看详情
    addOrUpdateHandle(id,mark,type){
      console.log(id,type);
      if(mark=="purchase"){
        this.purchaseVisible = true
        this.$nextTick(() => {
          this.$refs.Purchaseref.init(id, type)
        })
      }
      if(mark=='plan'){
        this.planVisible = true
        this.$nextTick(() => {
          this.$refs.Planref.init(id, type)
        })
      }
      if(mark=="picking"){
        this.pickingVisible = true
        this.$nextTick(() => {
          this.$refs.Pickingref.init(id, type)
        })
      }
      if(mark=="productOut"){
        this.productOutVisible = true
        this.$nextTick(() => {
          this.$refs.ProductOutref.init(id, type)
        })
      }
      if(mark=="production"){
        this.productionVisible = true
        this.$nextTick(() => {
          this.$refs.Productionref.init(id, type)
        })
      }
      if(mark=="productionOut"){
        this.productionrOutVisible = true
        this.$nextTick(() => {
          this.$refs.ProductionrOutref.init(id, type)
        })
      }
      
      if(mark=="warehousing"){
        this.warehousingVisible = true
        this.$nextTick(() => {
          this.$refs.Warehousingref.init(id, type)
        })
      }
       
      if(mark=="delivery"){
        this.deliveryVisible = true
        this.$nextTick(() => {
          this.$refs.Deliveryref.init(id, type)
        })
      }
      
      if(mark=="reconciliation"){
        this.reconciliatioVisible = true
        this.$nextTick(() => {
          this.$refs.Reconciliationref.init(id, type)
        })
      }
    },


      // 背景颜色处理
      tableCellStyle({row, column, rowIndex, columnIndex}) {
       
        if(columnIndex === 8) {  
          if(row.distributionFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        if(columnIndex === 9) {  
          if(row.planSchFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        if(columnIndex === 10) {  
          if(row.mrpFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        if(columnIndex === 11) {  
          if(row.pickingFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        if(columnIndex === 12) {  
          if(row.productionFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        if(columnIndex === 13) {  
          if(row.warehousingFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        if(columnIndex === 14) {  
          if(row.deliveryFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
        
        if(columnIndex === 15) {  
          if(row.reconciliationFlag){
            return 'background:#00b050!important'
          }else{
            return 'background:#ffc000!important'

          }
           
        } 
              
      },
    tableRowClassName({row, rowIndex}) {
       //把每一行的索引放进row
     row.index = rowIndex;
    },
    selectedHighlight({row, rowIndex}) {
         if ((this.getIndex) === rowIndex ) {
            return {
          "background-color": "#fedcbd"
       };
     }
    },
    rowClick(row) {
      console.log("row",row);
      if(this.titleFlag==1)return
        this.getIndex=row.index
        this.currentProductInfo=row
        console.log("currentProductInfo",this.currentProductInfo);
        this.getsaleOrderLineListFun()
    },




    getAllOrderListFun(){
      if(this.orderDateArr.length){
        this.orderForm.orderStartDate=this.orderDateArr[0]
        this.orderForm.orderEndDate=this.orderDateArr[1]
      }
      getsaleOrderList(this.orderForm).then(res=>{
        console.log("res=>订单数据",res);
        this.allOrderList=res.data.records
        this.total=res.data.total
      })
    },
    reset(){
      this.orderDateArr=[]
      this.orderForm={
            cooperativePartnerCode:"",
            cooperativePartnerName:"",
            orderNo:"",
            orderStartDate:"",
            orderEndDate:"",

            pageSize: 20,
            pageNum: 1,
      }
      this.getAllOrderListFun()
    },
    selectOrder(item){
      console.log("选择的订单",item);
      this.orderVisible=false
      this.activeName='distribution'
      this.getOrderDetailFun(item.id)
    },
    handleClose(){                                                                                   
      this.orderVisible=false
    },

    getOrderDetailFun(id){
      this.id=id
        getOrderDetail(this.id).then(res=>{
            console.log("订单详情",res);
            this.orderDataForm=res.data.order
            this.getsaleOrderLineListFun()
            this.orderDataFormLine=res.data.orderLines
        })
    },
  
    // 生产——查看来源
    getOrderSourceList(id) {
      let obj = {
        "createByName": "",
        "endTime": "",
        "endUpdateTime": "",
        "keyword": "",
        "orderItems": [
          {
            "asc": true,
            "column": ""
          }
        ],
        "productionOrderId": id,
        "startTime": "",
        "startUpdateTime": ""
      }
      getOrderSourceList(obj).then(res => {
        console.log("订单来源明细", res);
        if (res.data.records.length) {
          this.sourceList = res.data.records
          this.sourceDialog = true
        } else {
          this.$message.error("暂无来源明细")
        }
      })
    },
   
    handleClick(e){
        console.log("e",e);
        // 产品跟踪
        this.pageNum=1
        this.pageSize=20
        if( this.titleFlag==2){
          if(e.name=='distribution'){
            console.log(666);
            this.getsaleOrderLineListFun()
          }
          if(e.name=="plan"){
            this.getPlanListFun()
            }
            if(e.name=="mrp"){
                this.getproduceData()
            }
            if(e.name=="purchase"){
                this.purchaseOrderListFun()
            }
            if(e.name=='picking'){
              this.getWithdrawalListFun()
            }
            if(e.name=="productOut"){
                this.getProductOrderListFun()
            }
            if(e.name=="production"){
              this.getsaleOrderLineListFun()
            }
            if(e.name=="productionOut"){
                this.wxpurchaseOrderListFun()
            }
            if(e.name=="warehousing"){
              this.getWarehouseListFun()
            }
            if(e.name=="delivery"){
              this.getQuotationdatasendlistFun()
            }
            if(e.name=="reconciliation"){
                this.getQuotationdatasendlistFun()
            }
        }
        // 分配distribution 计划plan mrp 采购purchase 领料picking 产品外协productOut 生产production 工序外协productionOut 入库warehousing 发货delivery 对账reconciliation
        // 订单跟踪
        if(this.titleFlag==1){
          if(e.name=='distribution'){
            console.log(666);
            this.getsaleOrderLineListFun()
          }
            if(e.name=="plan"){
                this.getPlanListFun()
            }
            if(e.name=="mrp"){
                this.getproduceData()
            }
            if(e.name=="purchase"){
                this.purchaseOrderListFun()
            }
            if(e.name=='picking'){
                this.getWithdrawalListFun()
            }
            if(e.name=="productOut"){
                this.getProductOrderListFun()
            }
            if(e.name=="production"){
                this.getprodOrderListFun()
            }
            if(e.name=="productionOut"){
                this.wxpurchaseOrderListFun()
            }
            if(e.name=="warehousing"){
                this.getWarehouseListFun()
            }
            if(e.name=="delivery"){
                this.getQuotationdatasendlistFun()
            }
            if(e.name=="reconciliation"){
                this.getfinAccountListFun()
            }
        }
    }, 
    getfinAccountListFun(){
      let obj={
        approvalStatus:"ok",
        documentStatus:"submit",
        reconciliationType:"receivable",
        ordersId:this.orderDataForm.id,
        pageSize:this.pageSize,
       pageNum:this.pageNum,
      }
      getfinAccountList(obj).then(res=>{
        console.log("发货",obj);
        this.reconciliationData=res.data.records
        this.total=res.data.total
      })
    },
    // 发货
    getQuotationdatasendlistFun(){
      if(this.titleFlag==1){
        let obj={
          ordersId:this.orderDataForm.id,
          documentStatus:"submit",
          orderCategory: "assembly",
          returnDeliveryType:"delivery",
          notifyType:'sale',
          pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        getQuotationdatasendlist(obj).then(res=>{
          console.log("发货",obj);
          this.deliveryData=res.data.records
        this.total=res.data.total
        })
      }else{
        let obj={
          productCode:this.currentProductInfo.productCode,
          ordersId:this.orderDataForm.id,
          documentStatus:"submit",
          orderCategory: "assembly",
          returnDeliveryType:"delivery",
          notifyType:'sale',
          pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        getQuotationdatasendlist(obj).then(res=>{
          console.log("发货",obj);
          this.deliveryData=res.data.records
        this.total=res.data.total
        })
      }
      
      
    },
    // 入库
    getWarehouseListFun(){
      if(this.titleFlag==1){
        let obj={
          ordersId:this.orderDataForm.id,
          documentStatus:"submit",
          pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        getWarehouseList(obj).then(res=>{
          console.log('入库',res);
          this.warehousingData=res.data.records
        this.total=res.data.total
        })
      }else{
        let obj={
          productCode:this.currentProductInfo.productCode,
          ordersId:this.orderDataForm.id,
          documentStatus:"submit",
          pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        getWarehouseList(obj).then(res=>{
          console.log('入库',res);
          this.warehousingData=res.data.records
        this.total=res.data.total
        })
      }
     
    },
    // 生产
    getprodOrderListFun(){
        let obj={
            ordersId:this.orderDataForm.id,
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        getprodOrderList(obj).then(res=>{
            console.log("生产订单",res);
            this.productionData=res.data.records
        this.total=res.data.total
        })
    },
    // 产品外协
    getProductOrderListFun(){
        let obj={
            approvalStatus:"ok",
            ordersId:this.orderDataForm.id,
            orderType:"external",
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        purchaseOrderList(obj).then(res=>{
            console.log("产品外协:",res);
            this.productOutData=res.data.records
        this.total=res.data.total
        })
    },
    // 工序外协
    wxpurchaseOrderListFun(){
        let obj={
            approvalStatus:"ok",
            ordersId:this.orderDataForm.id,
            orderType:"external_processes",
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        purchaseOrderList(obj).then(res=>{
            console.log("工序外协:",res);
            this.productionOutData=res.data.records
        this.total=res.data.total
        })
    },
    // 采购
    purchaseOrderListFun(){
        let obj={
            approvalStatus:"ok",
            ordersId:this.orderDataForm.id,
            orderType:"procure",
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        purchaseOrderList(obj).then(res=>{
            console.log("采购数据:",res);
            this.purchaseData=res.data.records
        this.total=res.data.total
        })
    },
    // 领料
    getWithdrawalListFun(){
        if(this.titleFlag==1){
          let obj={
            approvalStatus:"ok", 
            documentStatus:"submit",
            ordersId:this.orderDataForm.id,
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        WithdrawalList(obj).then(res=>{
            console.log("领料数据",res);
            this.pickingData=res.data.records
        this.total=res.data.total
        })
        }else{
          let obj={
            approvalStatus:"ok", 
            documentStatus:"submit",
            productCode:this.currentProductInfo.productCode,
          ordersId:this.orderDataForm.id,
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        WithdrawalList(obj).then(res=>{
            console.log("领料数据",res);
            this.pickingData=res.data.records
        this.total=res.data.total
        })
        }
    },
    // 根据订单号获取计划列表数据
    getPlanListFun(){
        let obj={
            ordersId:this.orderDataForm.id,
            documentStatus: "submit",
            pageSize:this.pageSize,
       pageNum:this.pageNum,
        }
        getPlanList(obj).then(res=>{
            console.log("计划数据",res);
            this.planData=res.data.records
        this.total=res.data.total
        })
     
        
    },
    // MRP切换
    handleMRPClick(val) {
      this.mrpactiveName = val.name
      if (val.name == 'mrpproduce') {
        this.getproduceData()

      } else if (val.name == 'mrppurchase') {
        this.getpurchaseDataa()

      } else if (val.name == 'mrpout') {
        this.getouteData()

      }
    },
    // MRP_生产
    getproduceData() {
        this.produceForm.ordersId=this.orderDataForm.id
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
          console.log("this.produceData", this.produceData);
          this.total1 = res.data.total
         
        })
    },
    // MRP_采购

    getpurchaseDataa() {
        this.purchaseForm.ordersId=this.orderDataForm.id

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
            this.purchaseDataMRP = arr
            this.total2 = res.data.total
          
        })
    },
    // MRP_外协
    getouteData() {
        this.outForm.ordersId=this.orderDataForm.id

        getMRPMaterialList(this.outForm).then(res => {
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
    // 订单切换
    changeOrder(){
      this.orderVisible=true
      this.getAllOrderListFun()
    },
    // 选择订单跟踪
    orderFollow(){
      if(this.titleFlag==1)return
      this.pageNum=1
      this.pageSize=20
        this.titleFlag=1
        this.activeName='distribution'
        this.getsaleOrderLineListFun()
        

    }, 
    getsaleOrderLineListFun(){
      if(this.titleFlag==1){
        let obj={
            ordersId:this.orderDataForm.id,
            documentStatus: "submit",
            pageSize:this.pageSize,
       pageNum:this.pageNum,
       distributeStatus: "distributed"
        }
        getsaleOrderLineList(obj).then(res=>{
            console.log("计划数据",res);
          this.$nextTick(()=>{
            this.distributionData=res.data.records
        this.total=res.data.total
          })
        })
      }else{
        let obj={
            ordersId:this.orderDataForm.id,
          productCode:this.currentProductInfo.productCode,
          documentStatus:'submit',
          pageSize:this.pageSize,
       pageNum:this.pageNum,
       distributeStatus: "distributed"
        }
        getsaleOrderLineList(obj).then(res=>{
          console.log("产品跟踪",res);
          this.distributionData=res.data.records
        this.total=res.data.total
        })
      }
      
    },
    
    // 选择产品跟踪
    productFollow(){
      if(this.titleFlag==2)return
      this.pageNum=1
      this.pageSize=20
        this.titleFlag=2
        this.activeName='distribution'
        
        this.currentProductInfo=this.orderDataFormLine[0]
        this.$nextTick(()=>{
          this.rowClick(this.currentProductInfo)
        })
        this.getsaleOrderLineListFun()
        console.log("currentProductInfo",this.currentProductInfo);
    },
    init(id){
        this.getOrderDetailFun(id)
    },
    // 收起放下
    handleChange(val) {
      console.log(val);
    },
    goBack() {
      this.$emit("close");
    },
    sourceTypeFormatter(row) {
      let data = this.originTypeList.find(item => item.value === row.sourceType)
      return data ? data.label : row.sourceType
    },
  },
};
</script>
  <style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .JNPF-common-layout-center .JNPF-flex-main .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}


//.el-button--small {
// padding: 1;
//}
</style>
  <style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 10px;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 11px 10px;
}
</style>
  <style scoped lang="scss">
  
.el-table .success-row {
  background: #00b050!important;
}
.el-table .alarm-row {
  background: #ffc000!important;
}

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
::v-deep .el-collapse{
    border-top: none;
}
.main{
    padding: 10px 20px;
}
::v-deep .el-collapse-item__header{
    background-color: rgb(250, 250, 250);
    font-size: 18px;
    font-weight: 600;
    padding-left: 10px;
    position: relative;
}
::v-deep .el-collapse-item__content{
    // margin-top: 18px;
    padding-bottom: 0px;
}
::v-deep .el-col .el-form-item--small .el-form-item__content{
    line-height: 32px;
}
::v-deep.el-tabs__item{
    border-bottom: 1px solid #E4E7ED;
}
::v-deep.stageOnfo .el-tabs__header{
    padding-bottom: 0!important;
}
::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 0px !important;
  margin-bottom: 0;
  padding-left: 0px !important;
  background: #fff;
}
.stafeOnfo{
    margin-bottom: 10px;
}
.stafeOnfo  ::v-deep .el-tabs__content{
  padding: 0;
}
.el-tabs__content{
    margin-top: 10px;
}
::v-deep .el-collapse-item__wrap{
    border-bottom: none;
}
.highlight-row {
  background-color: #fedcbd ;
}
::v-deep .el-table tbody tr:hover>td { 
    background-color:transparent!important
}
.aaa{
  background-color: red;
}
.bbb{
  background-color: green;
}
.el-table__row:hover {
  background-color: transparent !important;
}
.status{
  font-weight:400; display:inline-block;width:80px;height:30px;background:#ffc000;text-align:center;line-height:30px;
  position: absolute;
  right: 35px;

}
.label_t{
  font-size: 15px;
}
</style>