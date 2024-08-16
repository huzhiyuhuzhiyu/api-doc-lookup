<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="组装需求" name="assemble">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="assembleForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="assembleForm.bomFlag" placeholder="有无BOM" clearable style="width: 100%;">
                      <el-option v-for="(item, index) in bomFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="assembleForm.planNo" placeholder="计划单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="bulkRelease('assembleData')">批量下达</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getassembleData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="assembleRef" v-loading="listLoading" :data="assembleData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="handleProduce"
                :checkSelectable="disproduceData">
                <el-table-column prop="productDrawingNo" label="品名规格" width="320" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="bomId" label="是否有BOM" min-width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div :style="scope.row.bomId ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="立即组装" width="320" sortable="custom" />
                <el-table-column prop="planNo" label="计划单号" width="320" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="320" sortable="custom" />
                <el-table-column prop="productName" label="需组装数量" min-width="120" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" width="180" />
                <el-table-column prop="planEndDate" label="计划结束日期" width="180" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" />
                <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" />
                <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" />
                <el-table-column prop="oil" label="油脂" min-width="100" />
                <el-table-column prop="oilQuantity" label="油脂量" min-width="120" />
                <el-table-column prop="clearance" label="游隙" min-width="100" />
                <el-table-column prop="packagingMethod" label="包装方式" min-width="120" />
                <el-table-column prop="specialRequire" label="特殊要求" min-width="120" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      @click.native="complateSetFun(scope.row.id, 'produce')">齐套查询</el-button>

                  </template>

                </el-table-column>
              </JNPF-table>
              <pagination :total="total1" :page.sync="assembleForm.pageNum" :limit.sync="assembleForm.pageSize"
                @pagination="getassembleData">
                <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">需组装数量：{{ outputQuantity }}</span>
                </div>
              </pagination>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="生产需求" name="produce">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="bulkRelease('produce')">批量下达</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="dataTable" v-loading="listLoading" :data="producrData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="handleProduce"
                :checkSelectable="disproduceData">
                <el-table-column prop="productDrawingNo" label="品名规格" width="320" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="bomId" label="是否有BOM" min-width="140" sortable="bomId">
                  <template slot-scope="scope">
                    <div :style="scope.row.bomId ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="productDrawingNo" label="立即生产" width="320" sortable="custom" />
                <el-table-column prop="planNo" label="计划单号" width="320" sortable="custom" />
                <el-table-column prop="planNo" label="单位" width="320" />
                <el-table-column prop="productName" label="安全库存" min-width="120" sortable="custom" />
                <el-table-column prop="planNo" label="库存数量" width="180" sortable="custom" />
                <el-table-column prop="planNo" label="可用库存数量" width="180" sortable="custom" />
                <el-table-column prop="sealingCoverTyping" label="需求数量" min-width="120" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="损耗数量" min-width="120" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="计划在制数量" min-width="120" sortable="custom" />
                <el-table-column prop="oil" label="实际在制数量" min-width="100" sortable="custom" />
                <el-table-column prop="oilQuantity" label="占用数量" min-width="120" sortable="custom" />
                <el-table-column prop="clearance" label="需生产数量" min-width="100" sortable="custom" />
                <el-table-column prop="packagingMethod" label="计划开始日期" min-width="120" sortable="custom" />
                <el-table-column prop="specialRequire" label="计划结束日期" min-width="120" sortable="custom" />

                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag"
                      @click.native="retrospectFun(scope.row.id, 'produce')">追溯主产品</el-button>
                    <el-button size="mini" type="text"
                      @click.native="complateSetFun(scope.row.id, 'produce')">齐套查询</el-button>

                  </template>

                </el-table-column>
              </JNPF-table>
              <pagination :total="total2" :page.sync="produceForm.pageNum" :limit.sync="produceForm.pageSize"
                @pagination="getproduceData" />
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="采购需求" name="purchase">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="purchaseForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="purchaseForm.workOrderNo" placeholder="请输入工作令号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="purchaseForm.productDrawingNo" placeholder="请输入产品图号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right; margin-right: 20px" size="mini" type="primary" icon="el-icon-search"
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus"
                    @click="bulkRelease('purchase')">批量下达</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="tableDataAss" v-loading="listLoading" :data="purchaseData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC show-summary :summary-method="getSummaries2"
                @selection-change="handlePurchase" :checkSelectable="dispurchaseData">
                <el-table-column prop="planNo" label="计划单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" min-width="160" sortable="custom" />

                <!-- <el-table-column prop="demandType" label="需求类型" width="160">
                  <template slot-scope="scope">
                    <div v-if="scope.row.demandType == 'finished_materials'">成品物料</div>
                    <div v-if="scope.row.demandType == 'semi_finished_materials'">半成品物料</div>

                  </template>
                </el-table-column> -->
                <el-table-column prop="originNo" label="来源单号" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="immediatelyBuyFlag" label="立即采购" width="100">
                  <template slot-scope="scope">
                    <div :style="scope.row.immediatelyBuyFlag == 1 ? 'color:red;' : ''
                      ">
                      {{ scope.row.immediatelyBuyFlag == 1 ? "是" : "否" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="safeInventory" label="安全库存" width="100"></el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="inTransitUnOccupancyQuantity" label="在制未占用数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="lossNum" label="损耗数量" width="100"></el-table-column>
                <!-- <el-table-column prop="totalInProcessQuantity" label="总在制数量" width="120"></el-table-column> -->
                <!-- <el-table-column prop="inProcessQuantity" label="在制数量" width="120"></el-table-column> -->

                <el-table-column prop="occupancyQuantity" label="占用数量" width="120">
                </el-table-column>
                <el-table-column prop="outputQuantity" label="采购数量" width="120" sortable="custom" />

                <el-table-column prop="issuedQuantity" label="已下达数量" width="120">
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="160">
                </el-table-column>
                <el-table-column prop="deliveryDate" label="订单交货日期" width="160" sortable="custom" />
                <el-table-column prop="replaceStatus" label="替代状态" min-width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.replaceStatus == 'normal'">正常</div>
                    <el-link type="primary" @click.native="viewData(scope.row.id, 'look')"
                      v-if="scope.row.replaceStatus == 'applying'">替代中</el-link>
                    <div v-if="scope.row.replaceStatus == 'replaced'">
                      已替代
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="需求时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="运算人" min-width="100" />
                <el-table-column prop="remark" label="备注" min-width="160" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag"
                      @click.native="retrospectFun(scope.row.id, 'purchase')">追溯主产品</el-button>
                    <el-button size="mini" type="text"
                      :disabled="(scope.row.mainProductFlag ? true : scope.row.replaceStatus == 'normal' ? false : true) || Number(scope.row.issuedQuantity) > 0"
                      @click.native="alternativeProducts(scope.row.id, 'add')">替代产品</el-button>

                  </template>

                </el-table-column>
              </JNPF-table>
              <pagination :total="total3" :page.sync="purchaseForm.pageNum" :limit.sync="purchaseForm.pageSize"
                @pagination="initData" />
              <!-- <pagination :total="total" :page.sync="orderForm.pageNum" :limit.sync="orderForm.pageSize"
                @pagination="initData" /> -->
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="外协需求" name="out">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="outForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="outForm.workOrderNo" placeholder="请输入工作令号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="outForm.productDrawingNo" placeholder="请输入产品图号" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-button style="float: right; margin-right: 20px" size="mini" type="primary" icon="el-icon-search"
                  @click="moreQueries()">更多查询</el-button>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="JNPF-common-head">
                <div>
                  <el-button size="mini" type="primary" icon="el-icon-plus" @click="bulkRelease('out')">批量下达</el-button>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="tableDataAsss" v-loading="listLoading" :data="outData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC show-summary :summary-method="getSummaries3"
                @selection-change="handleOut" :checkSelectable="disOutData">
                <el-table-column prop="planNo" label="计划单号" width="180" sortable="custom"></el-table-column>
                <el-table-column prop="productCode" label="产品编码" width="150" sortable="custom"></el-table-column>
                <el-table-column prop="productName" label="产品名称" min-width="120" sortable="custom" />
                <el-table-column prop="productDrawingNo" label="产品图号" fixed="left" min-width="160" sortable="custom" />
                <!-- <el-table-column
                  prop="bomFlagText"
                  label="是否有BOM"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    <div>{{ scope.row.bomId ? "有" : 否 }}</div>
                  </template>
                </el-table-column> -->
                <!-- <el-table-column prop="demandType" label="需求类型" width="120">
                  <template slot-scope="scope">
                    <div v-if="scope.row.demandType == 'out'">外协需求</div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="originNo" label="来源单号" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="workOrderNo" label="工作令号" width="160" sortable="custom"></el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="safeInventory" label="安全库存" width="100"></el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="120" sortable="custom"></el-table-column>
                <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>
                      {{ scope.row.availableQuantity ? scope.row.availableQuantity : '0' }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="inTransitUnOccupancyQuantity" label="在制未生产数量" min-width="140">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="lossNum" label="损耗数量" width="100"></el-table-column>
                <!-- <el-table-column prop="totalInProcessQuantity" label="总在制数量" width="120"></el-table-column> -->
                <!-- <el-table-column prop="inProcessQuantity" label="在制数量" width="120"></el-table-column> -->

                <el-table-column prop="occupancyQuantity" label="占用数量" width="120">
                </el-table-column>
                <el-table-column prop="outputQuantity" label="外协数量" width="120" sortable="custom" />

                <el-table-column prop="issuedQuantity" label="已下达数量" width="120">
                </el-table-column>
                <el-table-column prop="mainUnit" label="单位" width="160">
                </el-table-column>
                <el-table-column prop="deliveryDate" label="订单交货日期" width="160" sortable="custom" />
                <el-table-column prop="partnerName" label="客户名称" width="220" sortable="custom" />

                <el-table-column prop="createTime" label="需求时间" min-width="180" sortable="custom" />
                <el-table-column prop="createByName" label="运算人" min-width="100" />
                <el-table-column prop="remark" label="备注" min-width="160" />

                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag"
                      @click.native="retrospectFun(scope.row.id, 'out')">追溯主产品</el-button>
                    <el-button size="mini" type="text"
                      @click.native="complateSetFun(scope.row.id, 'out')">齐套查询</el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total4" :page.sync="outForm.pageNum" :limit.sync="outForm.pageSize"
                @pagination="initData" />
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

    <!-- <el-dialog :title="'物料下达'" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center wlxd" width="1200px">

      <JNPF-table ref="tableDataAss" v-loading="listLoading" :data="orderDetailData" style="margin-top: 20px"
        v-if="orderForm.demandType == 'produce'" height="600" hasC @selection-change="selectInsertOrderFun">
        <el-table-column prop="productCode" label="产品编码" width="130"></el-table-column>
        <el-table-column prop="productName" label="产品名称" width="160" />
        <el-table-column prop="productDrawingNo" label="产品图号" min-width="460" />

        <el-table-column prop="outputQuantity" label="生产数量" width="100" v-if="orderForm.demandType == 'produce'" />
        <el-table-column prop="outputQuantity" label="采购数量" width="100" v-if="orderForm.demandType == 'purchase'" />
        <el-table-column prop="outputQuantity" label="外协数量" width="100" v-if="orderForm.demandType == 'out'" />
        <el-table-column prop="deliveryDates" label="订单交货日期" width="160" v-if="
          orderForm.demandType == 'out' || orderForm.demandType == 'purchase'
        " />
        <el-table-column prop="issuedQuantity" label="已下达数量" width="120"></el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期" width="180" fixed="right">
          <template slot="header">
            <span class="required">*</span>交货日期
          </template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd" style="width: 100%"
              :disabled="orderForm.demandType == 'produce'" placeholder="请选择交货日期"
              @change="selectDate(scope.row.deliveryDate)">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="productionQuantity" label="下达数量" width="120" v-if="orderForm.demandType == 'produce'"
          fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.productionQuantity" disabled placeholder="请输入下达数量">{{
              scope.row.productionQuantity }}</el-input>
          </template>
        </el-table-column>
        <el-table-column prop="planDemandQuantity" :key="1" label="下达数量" width="120"
          v-if="orderForm.demandType == 'purchase'" fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.planDemandQuantity" disabled placeholder="请输入下达数量">{{
              scope.row.planDemandQuantity }}</el-input>
          </template>
        </el-table-column>

        <el-table-column prop="planDemandQuantity" :key="2" label="下达数量" width="120"
          v-if="orderForm.demandType == 'out'" fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.planDemandQuantity" disabled placeholder="请输入下达数量">{{
              scope.row.planDemandQuantity }}</el-input>
          </template>
        </el-table-column>
        <el-table-column prop="insertOrderFlag" :key="5" label="是否插单(紧急)" width="140" fixed="right"
          v-if="orderForm.demandType == 'produce'">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.insertOrderFlag"></el-checkbox>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope)">删除</el-button>
          </template>
        </el-table-column>
      </JNPF-table>
      <JNPF-table ref="tableDataAss" v-loading="listLoading" :data="orderDetailData" style="margin-top: 20px" v-else
        height="600">
        <el-table-column prop="productCode" label="产品编码" width="130"></el-table-column>
        <el-table-column prop="productName" label="产品名称" width="160" />
        <el-table-column prop="productDrawingNo" label="产品图号" min-width="460" />

        <el-table-column prop="outputQuantity" label="生产数量" width="100" v-if="orderForm.demandType == 'produce'" />
        <el-table-column prop="outputQuantity" label="采购数量" width="100" v-if="orderForm.demandType == 'purchase'" />
        <el-table-column prop="outputQuantity" label="外协数量" width="100" v-if="orderForm.demandType == 'out'" />
        <el-table-column prop="deliveryDates" label="订单交货日期" width="160" v-if="
          orderForm.demandType == 'out' || orderForm.demandType == 'purchase'
        " />
        <el-table-column prop="issuedQuantity" label="已下达数量" width="120"></el-table-column>
        <el-table-column prop="deliveryDate" label="交货日期" width="180" fixed="right">
          <template slot="header">
            <span class="required">*</span>交货日期
          </template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd" style="width: 100%"
              :disabled="orderForm.demandType == 'produce'" placeholder="请选择交货日期"
              @change="selectDate(scope.row.deliveryDate)">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="productionQuantity" label="下达数量" width="120" v-if="orderForm.demandType == 'produce'"
          fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.productionQuantity" disabled placeholder="请输入下达数量">{{
              scope.row.productionQuantity }}</el-input>
          </template>
        </el-table-column>
        <el-table-column prop="planDemandQuantity" :key="1" label="下达数量" width="120"
          v-if="orderForm.demandType == 'purchase'" fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.planDemandQuantity" disabled placeholder="请输入下达数量">{{
              scope.row.planDemandQuantity }}</el-input>
          </template>
        </el-table-column>

        <el-table-column prop="planDemandQuantity" :key="2" label="下达数量" width="120"
          v-if="orderForm.demandType == 'out'" fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.planDemandQuantity" disabled placeholder="请输入下达数量">{{
              scope.row.planDemandQuantity }}</el-input>
          </template>
        </el-table-column>
        <el-table-column prop="insertOrderFlag" :key="5" label="是否插单(紧急)" width="140" fixed="right"
          v-if="orderForm.demandType == 'produce'">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.insertOrderFlag"></el-checkbox>
          </template>
        </el-table-column>


        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="JNPF-table-delBtn" @click="handleDel(scope)">删除</el-button>
          </template>
        </el-table-column>
      </JNPF-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="productVisible = false">{{
          $t("common.cancelButton")
        }}</el-button>
        <el-button :loading="btnLoading" type="primary" @click="submitAllProduct()">
          确定</el-button>
      </span>
    </el-dialog> -->

    <ComplateSetForm v-if="complateSetFormVisible" ref="complateSetForm" @refreshDataList="initData"
      @close="closeForm" />
    <RetrospectForm v-if="retrospectFormVisible" ref="retrospectForm" @refreshDataList="initData" @close="closeForm" />
  </div>
</template>

<script>
import {
  getMRPMaterialList,
  demandProcureissue,
  demandProduceissue,
  getDemandList,
  getMaterialDemandReport
} from "@/api/calculationList/MRPOperation";

import Form from "./Form";
import ComplateSetForm from "./complateSetForm";
import RetrospectForm from "./retrospectForm";
import moment from "moment";
import { index } from 'mathjs';
export default {
  name: "carrierProfile",
  components: { Form, ComplateSetForm, RetrospectForm },
  data() {
    return {
      // 组装
      total1: 0,
      assembleData: [],
      assembleForm: {
        demandType: "assemble",
        demandState: "not_finish",
        documentStatus: "submit",
        productDrawingNo: "",
        planNo: "",
        bomFlag: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      bomFlagList: [
        { label: "有BOM", value: true },
        { label: "无BOM", value: false },
      ],
      //---------

      total2: 0,
      total3: 0,
      total4: 0,
      activeName: "assemble",
      produceData: [],
      purchaseData: [],
      outData: [],

      produceForm: {
        demandType: "produce",
        demandState: "not_finish",
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      purchaseForm: {
        demandType: "purchase",
        demandState: "not_finish",
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      outForm: {
        demandType: "out",
        demandState: "not_finish",
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      assembleNum: 0,//组装数量
      totalDemandQuantity: 0,//需求数量
      outputQuantity: 0,//需组装/生产/采购/外协数量
      lossNum: 0,//损耗数量
      planInTransitQuantity: 0,//计划在制在途数量
      inTransitUnOccupancyQuantity: 0,//实际在制在途数量
      occupancyQuantity: 0,//当前预占数量
















    };
  },
  computed: {

  },
  watch: {
    produceArr: {
      handler: function (newValue) {
        console.log(888, newValue);
      },
      deep: true,
    },
  },
  created() {
    this.getassembleData();

    // this.form.customerRecognitionTime = moment(Number(new Date().getTime())).format('YYYY-MM-DD')
  },
  methods: {
      // table切换
      handleClick() {
      console.log(this.activeName);
      if (this.activeName == "assemble") {
        this.getassembleData()
      }
      if (this.activeName == "produce") {
        this.getproduceData()

      }
      if (this.activeName == "purchase") {
        this.getpurchaseDataa()

      }
      if (this.activeName == "out") {
        this.getouteData()
        
      }
    },


    // 齐套查询
    QTsearch(data, type) {

    },
    // 组装列表数据
    getassembleData() {
      getMaterialDemandReport(this.assembleForm).then(res => {
        console.log("组装res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          this.total1 = res.data.page.total
          this.assembleData = tableData

          this.totalDemandQuantity = totalData.demandQuantity
          this.outputQuantity = totalData.outputQuantity
        }
      })
    },
    // 生产列表数据
    getproduceData() {
      getMaterialDemandReport(this.produceForm).then(res => {
        console.log("生产res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          this.produceData = tableData
          this.total2 = res.data.page.total

          this.totalDemandQuantity = totalData.demandQuantity
          this.outputQuantity = totalData.outputQuantity
          this.lossNum = totalData.lossNum
          this.planInTransitQuantity = totalData.planInTransitQuantity
          this.inTransitUnOccupancyQuantity = totalData.inTransitUnOccupancyQuantity
          this.occupancyQuantity = totalData.occupancyQuantity
        }
      })
    },
    // 采购列表数据
    getpurchaseDataa() {
      getMaterialDemandReport(this.purchaseForm).then(res => {
        console.log("采购res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          this.purchaseData = tableData
          this.total3 = res.data.page.total

          this.totalDemandQuantity = totalData.demandQuantity
          this.outputQuantity = totalData.outputQuantity
          this.lossNum = totalData.lossNum
          this.planInTransitQuantity = totalData.planInTransitQuantity
          this.inTransitUnOccupancyQuantity = totalData.inTransitUnOccupancyQuantity
          this.occupancyQuantity = totalData.occupancyQuantity

        }
      })
    },
       // 外协列表数据
       getouteData() {
      getMaterialDemandReport(this.outForm).then(res => {
        console.log("外协res", res);
        let totalData=res.data.total
        let tableData=res.data.page.records
        if(tableData.length){
          this.outData=tableData
          this.total4=res.data.page.total

          this.totalDemandQuantity=totalData.demandQuantity
          this.outputQuantity=totalData.outputQuantity
          this.lossNum=totalData.lossNum
          this.planInTransitQuantity=totalData.planInTransitQuantity
          this.inTransitUnOccupancyQuantity=totalData.inTransitUnOccupancyQuantity
          this.occupancyQuantity=totalData.occupancyQuantity
    
        }
      })
    },










    // 合计处理
    getSummaries1(param) {
      const { columns, data } = param;
      const sums = [];
      let arr = ['issuingQuantity', 'issuedQuantity', 'outputQuantity', 'demandQuantity']

      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        console.log("colums", column);

        if (index == 0 | index == 2 || index == 3 || index == 4 || index == 5 || index == 6 || index == 7 ||
          index == 8 || index == 9 || index == 11 ||
          index == 12 || index == 13 || index == 14 || index == 15 || index == 19 || index == 20 || index == 21 || index == 22 || index == 23 || index == 24 || index == 25 || index == 26) {
          sums[index] = '';
          return;
        }

        const values = this.producrData.map(item => item[column.property] ? Number(item[column.property]) : '');
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
          sums[index] = Math.round(sums[index] * 1000) / 1000;
        } else {
          sums[index] = null;
        }
      });
      console.log("sums", sums);
      return sums;

    },
    // 合计处理
    getSummaries2(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if (index == 0 | index == 2 || index == 3 || index == 4 || index == 5 || index == 6 || index == 7 ||
          index == 10 || index == 9 || index == 11 ||
          index == 12 || index == 13 || index == 16 || index == 17 || index == 18 || index == 19 || index == 20 || index == 21 || index == 22 || index == 23 || index == 24 || index == 25 || index == 26) {
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
          sums[index] = Math.round(sums[index] * 1000) / 1000;
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
        if (index === 1) {
          sums[index] = '合计';
          return;
        }
        if (index == 0 | index == 2 || index == 3 || index == 4 || index == 5 || index == 6 || index == 7 ||
          index == 10 || index == 9 || index == 11 ||
          index == 12 || index == 15 || index == 16 || index == 17 || index == 18 || index == 19 || index == 20 || index == 21 || index == 22 || index == 23 || index == 24 || index == 25 || index == 26) {
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
          sums[index] = Math.round(sums[index] * 1000) / 1000;
        } else {
          sums[index] = null;
        }
      });
      return sums;

    },

    selectInsertOrderFun(val) {
      console.log("val", val);
      this.orderDetailData.forEach(item => {
        item.insertOrderFlag = false
      })
      if (val.length > 0) {

        val.forEach(item => {
          this.orderDetailData[item.index].insertOrderFlag = true

        });
      } else {
        this.orderDetailData.forEach(item => {
          item.insertOrderFlag = false
        })
      }

    },
    complateSetFun(id, type) {
      console.log(id, type);
      this.complateSetFormVisible = true
      this.$nextTick(() => {
        this.$refs.complateSetForm.init(id, type);
      });

    },
    retrospectFun(id, type) {

      this.retrospectFormVisible = true
      this.$nextTick(() => {
        this.$refs.retrospectForm.init(id, type);
      });
    },
    selecesStartDateFun(e) {
      console.log("开始时间", e);
      let arr = JSON.parse(JSON.stringify(this.orderDetailData));
      if (arr.length) {
        arr.forEach((item) => {
          if (!item.planStartDate) {
            item.planStartDate = e;
          }
        });
      }
      this.orderDetailData = arr;
      console.log("this.orderDetailData", this.orderDetailData);
    },
    selecesEndDateFun(e) {
      console.log("结束时间", e);
      let arr = JSON.parse(JSON.stringify(this.orderDetailData));
      if (arr.length) {
        arr.forEach((item) => {
          if (!item.planEndDate) {
            item.planEndDate = e;
          }
        });
      }
      this.orderDetailData = arr;
    },
    // 批量选择时间
    selectDate(data, row) {
      this.orderDetailData.forEach((item) => {
        if (!item.deliveryDate) {
          item.deliveryDate = data;
        }
      });
      let arr = JSON.parse(JSON.stringify(this.purchaseArr));
      arr.forEach((item) => {
        if (!item.deliveryDate) {
          this.$set(item, "deliveryDate", data);
        }
      });
      this.purchaseArr = arr;
      console.log("purchaseArr", this.purchaseArr, this.orderDetailData);
    },
    checkPositiveInteger(row, index) {
      console.log(row, index);
      // 使用正则表达式验证输入的值是否为正整数
      this.orderDetailData[index].insertOrderSort = row.insertOrderSort.replace(
        /\D/g,
        ""
      );
    },
    // 生产 下达
    handleProduce(val) {
      console.log("生产", val);
      this.produceArr = val;
      this.produceArrList = JSON.parse(JSON.stringify(this.produceArr));
    },

    // 采购 下达
    handlePurchase(val) {
      console.log("采购", val, this.purchaseArr);
      this.purchaseArr = val;
      this.purchaseArrList = JSON.parse(JSON.stringify(this.purchaseArr));
    },
    // 外协 下达
    handleOut(val) {
      console.log("外协", val);
      this.outArr = val;
      this.outArrList = JSON.parse(JSON.stringify(this.outArr));
    },
    // 查看替代件信息
    viewData(id, btntype) {
      console.log(id, btntype);
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype);
      });
    },
    // 替代产品
    alternativeProducts(id, btntype) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype);
      });
    },
    submitAllProduct() {
      if (this.orderForm.demandType == "produce") {
        let flag = null;
        console.log(this.orderDetailData);
        for (let index = 0; index < this.orderDetailData.length; index++) {
          const item = this.orderDetailData[index];

          if (
            !item.productionQuantity ||
            Number(item.productionQuantity) == 0
          ) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的下达数量不能为0或为空",
              duration: 1500,
            });
            return;
          } else if (
            Number(item.productionQuantity) > Number(item.outputQuantity)
          ) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的下达数量不能超过生产数量",
              duration: 1500,
            });

            break;
          }
        }
        if (flag === false) return;
        this.btnLoading = true;
        let arr = [];
        console.log("this.produceArrList", this.produceArrList);
        this.orderDetailData.forEach((item) => {
          this.produceArr.forEach((ids, index) => {
            if (
              item.cooperativePartnerId === ids.cooperativePartnerId &&
              item.productsId === ids.productsId
            ) {
              ids.planEndDate = item.planEndDate;
              ids.planStartDate = item.planStartDate;
              ids.insertOrderFlag = item.insertOrderFlag
              ids.productionQuantity =
                this.produceArrList[index].productionQuantity;
              ids.materialDemandId =
                this.produceArrList[index].materialDemandId;
            }
          });
        });
        arr = this.produceArr;
        demandProduceissue(arr)
          .then((res) => {
            this.btnLoading = false;
            console.log("生产下达", res);
            this.$message({
              type: "success",
              message: "下达成功",
              duration: 1500,
            });
            this.produceArr = [];
            this.productVisible = false;
            this.tableFlag = false;
            this.initData();
          })
          .catch((error) => {
            this.btnLoading = false;
          });
      }
      if (this.orderForm.demandType == "out") {
        let flag = null;
        for (let index = 0; index < this.orderDetailData.length; index++) {
          const item = this.orderDetailData[index];
          console.log("item", item);
          if (
            !item.planDemandQuantity ||
            Number(item.planDemandQuantity) == 0
          ) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的下达数量不能为0或为空",
              duration: 1500,
            });
            return;
          } else if (
            Number(item.planDemandQuantity) > Number(item.outputQuantity)
          ) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的下达数量不能超过外协数量",
              duration: 1500,
            });
            break;
          } else if (!item.deliveryDate) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的交货日期",
              duration: 1500,
            });
            break;
          }
        }

        if (flag === false) return;
        this.btnLoading = true;
        let arr = [];
        this.orderDetailData.forEach((item) => {
          this.outArr.forEach((ids, index) => {
            if (
              item.cooperativePartnerId === ids.cooperativePartnerId &&
              item.productsId === ids.productsId
            ) {
              ids.deliveryDate = item.deliveryDate;
              ids.planDemandQuantity =
                this.outArrList[index].planDemandQuantity;
              ids.materialDemandId = this.outArrList[index].materialDemandId;
              ids.poolType = item.poolType;
            }
          });
        });
        arr = this.outArr;
        demandProcureissue(arr)
          .then((res) => {
            this.$message({
              type: "success",
              message: "下达成功",
              duration: 1500,
            });
            this.outArr = [];
            this.btnLoading = false;
            this.productVisible = false;
            this.tableFlag = false;
            this.initData();
          })
          .catch((error) => {
            this.btnLoading = false;
          });
      }
      if (this.orderForm.demandType == "purchase") {
        let flag = null;
        for (let index = 0; index < this.orderDetailData.length; index++) {
          const item = this.orderDetailData[index];

          if (
            !item.planDemandQuantity ||
            Number(item.planDemandQuantity) == 0
          ) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的下达数量不能为0或为空",
              duration: 1500,
            });
            return;
          } else if (
            Number(item.planDemandQuantity) > Number(item.outputQuantity)
          ) {
            flag = false;
            this.$message({
              type: "error",
              message: "第" + (index + 1) + "行的下达数量不能超过采购数量",
              duration: 1500,
            });
            break;
          } else if (!item.deliveryDate) {
            flag = false;
            this.$message({
              type: "error",
              message: "请选择第" + (index + 1) + "行的交货日期",
              duration: 1500,
            });
            break;
          }
        }
        if (flag === false) return;
        this.btnLoading = true;
        let arr = [];
        console.log("purchaseArr", this.purchaseArr);
        this.orderDetailData.forEach((item) => {
          console.log("item", item);
          this.purchaseArr.forEach((ids, index) => {
            if (item.productsId === ids.productsId) {
              ids.planDemandQuantity =
                this.purchaseArrList[index].planDemandQuantity;
              ids.materialDemandId =
                this.purchaseArrList[index].materialDemandId;
              ids.deliveryDate = item.deliveryDate;
              ids.poolType = item.poolType;
            }
          });
        });
        arr = this.purchaseArr;
        console.log("arr", arr);
        demandProcureissue(arr)
          .then((res) => {
            this.btnLoading = false;
            this.$message({
              type: "success",
              message: "下达成功",
              duration: 1500,
            });
            this.purchaseArr = [];
            this.productVisible = false;
            this.tableFlag = false;
            this.initData();
          })
          .catch((error) => {
            this.btnLoading = false;
          });
      }
    },
    // 批量下达
    bulkRelease(type) {
      if (type == "produce") {
        if (!this.produceArr.length) {
          this.$message({
            type: "error",
            message: "请先选择数据",
            duration: 1500,
          });
        } else {
          this.productVisible = true;
          this.tableFlag = true;
          console.log(222, this.produceArr);
          let arr = JSON.parse(JSON.stringify(this.produceArr));

          arr.forEach((item, index) => {
            item.materialDemandId = item.id;
            this.produceArrList[index].materialDemandId = item.id;
            item.insertOrderFlag = false;
            item.insertOrderSort = "";
            item.outputQuantity = Number(item.outputQuantity);
            item.issuedQuantity = Number(item.issuedQuantity);
            item.issuingQuantity = Number(item.issuingQuantity);
            this.produceArrList[index].productionQuantity =
              item.productionQuantity =
              item.outputQuantity -
              item.issuedQuantity -
              item.issuingQuantity;
            item.productionQuantity = item.productionQuantity =
              item.outputQuantity - item.issuedQuantity - item.issuingQuantity;
          });

          const mergedData = arr.reduce((acc, curr) => {
            console.log("object");
            // const key = curr.bussinessCode === "complete" ? `${curr.bussinessCode}-${curr.productsId}-${curr.cooperativePartnerId}` : `${curr.bussinessCode}-${curr.productsId}`;
            const key = `${curr.bussinessCode}-${curr.productsId}-${curr.cooperativePartnerId}`;
            if (!acc[key]) {
              acc[key] = { ...curr };
            } else {
              acc[key].outputQuantity += curr.outputQuantity;
              acc[key].issuedQuantity += curr.issuedQuantity;
              acc[key].productionQuantity += curr.productionQuantity;
              let earliestDate = arr.reduce((earliest, current) => {
                return earliest.deliveryDate < current.deliveryDate
                  ? earliest
                  : current;
              });
              acc[key].deliveryDate = earliestDate.deliveryDate;
            }
            return acc;
          }, {});

          const result = Object.values(mergedData);
          console.log("result", result);
          result.forEach((item, index) => {
            item.index = index
          })
          this.orderDetailData = JSON.parse(JSON.stringify(result));

        }
      } else if (type == "out") {
        if (!this.outArr.length) {
          this.$message({
            type: "error",
            message: "请先选择数据",
            duration: 1500,
          });
        } else {
          let arr = JSON.parse(JSON.stringify(this.outArr));

          arr.forEach((item, index) => {
            item.materialDemandId = item.id;
            this.outArrList[index].materialDemandId = item.id;
            item.deliveryDates = item.deliveryDate;
            item.deliveryDate = "";
            item.poolType = "external";
            item.outputQuantity = Number(item.outputQuantity);
            item.issuedQuantity = Number(item.issuedQuantity);
            this.outArrList[index].planDemandQuantity =
              item.planDemandQuantity = this.jnpf.numberFormat(
                item.outputQuantity - item.issuedQuantity,
                4
              );
          });

          const mergedArr = arr.reduce((acc, curr) => {
            const existingItem = acc.find(
              (item) => item.productsId === curr.productsId
            );
            if (existingItem) {
              existingItem.outputQuantity += Number(curr.outputQuantity);
              existingItem.issuedQuantity += Number(curr.issuedQuantity);
              existingItem.planDemandQuantity += this.jnpf.numberFormat(
                Number(curr.planDemandQuantity),
                4
              );
              let earliestDate = arr.reduce((earliest, current) => {
                return earliest.deliveryDates < current.deliveryDates
                  ? earliest
                  : current;
              });
              existingItem.deliveryDates = earliestDate.deliveryDates;
              // 如果productionQuantity是字符串，您可能需要进行适当的处理
              // 例如，如果是数字，则可以使用parseInt将其转换为数字并相加
            } else {
              acc.push(curr);
            }
            return acc;
          }, []);

          console.log(1111, mergedArr);
          mergedArr.forEach((item, index) => {
            item.index = index
          })
          this.orderDetailData = JSON.parse(JSON.stringify(mergedArr));
          this.productVisible = true;
          this.tableFlag = true;

          console.log(333, this.outArr);
        }
      } else if (type == "purchase") {
        if (!this.purchaseArr.length) {
          this.$message({
            type: "error",
            message: "请先选择数据",
            duration: 1500,
          });
        } else {
          let arr = JSON.parse(JSON.stringify(this.purchaseArr));

          arr.forEach((item, index) => {
            item.materialDemandId = item.id;
            this.purchaseArrList[index].materialDemandId = item.id;
            item.deliveryDates = item.deliveryDate;
            item.deliveryDate = "";
            item.poolType = "procure";
            item.outputQuantity = Number(item.outputQuantity);
            item.issuedQuantity = Number(item.issuedQuantity);
            this.purchaseArrList[index].planDemandQuantity =
              item.planDemandQuantity = this.jnpf.numberFormat(
                item.outputQuantity - item.issuedQuantity,
                4
              );
          });
          console.log("arr", arr);
          const mergedArr = arr.reduce((acc, curr) => {
            const existingItem = acc.find(
              (item) => item.productCode === curr.productCode
            );
            if (existingItem) {
              console.log(6);
              existingItem.outputQuantity += Number(curr.outputQuantity);
              existingItem.issuedQuantity += Number(curr.issuedQuantity);
              existingItem.planDemandQuantity += this.jnpf.numberFormat(
                Number(curr.planDemandQuantity),
                4
              );
              console.log("curr", curr);
              let earliestDate = arr.reduce((earliest, current) => {
                return earliest.deliveryDates < current.deliveryDates
                  ? earliest
                  : current;
              });
              existingItem.deliveryDates = earliestDate.deliveryDates;
              // 如果productionQuantity是字符串，您可能需要进行适当的处理
              // 例如，如果是数字，则可以使用parseInt将其转换为数字并相加
            } else {
              console.log(7, curr);
              acc.push(curr);
            }
            acc.forEach((item) => {
              item.outputQuantity = this.jnpf.numberFormat(
                item.outputQuantity,
                4
              );
              item.planDemandQuantity = this.jnpf.numberFormat(
                item.planDemandQuantity,
                4
              );
            });
            console.log("acc", acc);
            return acc;
          }, []);

          // console.log(1111, mergedArr);
          mergedArr.forEach((item, index) => {
            item.index = index
          })
          this.orderDetailData = JSON.parse(JSON.stringify(mergedArr));

          this.tableFlag = true;
          this.productVisible = true;

          console.log(333, this.purchaseArr, this.purchaseArrList);
        }
      }
    },
   
    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp;
      if (
        prop === "productCode" ||
        prop === "productName" ||
        prop === "productDrawingNo" ||
        prop === "routingName" ||
        prop === "routingCode"
      ) {
        newProp = prop;
      } else {
        newProp = prop.replace(/[A-Z]/g, (match) => "_" + match.toLowerCase());
      }
      this.orderForm.orderItems[0].asc = order === "ascending";
      this.orderForm.orderItems[0].column = order === null ? "" : newProp;

      this.initData();
    },

    moreQueries() {
      this.visible = true;
    },
    dataFormSubmit() {
      this.orderForm.pageNum = 1;

      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.orderForm.deliveryStartDate = this.deliveryDateArr[0];
        this.orderForm.deliveryEndDate = this.deliveryDateArr[1];
      } else {
        this.orderForm.deliveryStartDate = "";
        this.orderForm.deliveryEndDate = "";
      }
      if (this.createTimeArr && this.createTimeArr.length > 0) {
        this.orderForm.startTime = this.createTimeArr[0];
        this.orderForm.endTime = this.createTimeArr[1];
      } else {
        this.orderForm.startTime = "";
        this.orderForm.endTime = "";
      }
      this.initData();
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.formVisible = false;
      this.complateSetFormVisible = false
      this.retrospectFormVisible = false
      if (isRefresh) {
        this.keyword = "";
        this.initData();
      }
    },
    dispurchaseData(row) {
      return !row.disabled;
    },
    disproduceData(row) {
      return !row.disabled;
    },
    disOutData(row) {
      return !row.disabled;
    },
    initData() {
      this.listLoading = true;

      getMRPMaterialList(this.orderForm)
        .then((res) => {
          console.log("res++", res, this.orderForm);
          if (
            this.orderForm.demandType == "produce" ||
            this.orderForm.demandType == "finish_product" ||
            this.orderForm.demandType == "semi_finished"
          ) {
            if (res.data.records.length > 0) {
              res.data.records.forEach((item) => {
                if (
                  Number(item.issuedQuantity) + Number(item.issuingQuantity) >=
                  Number(item.outputQuantity)
                ) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });
            }
            this.producrData = res.data.records;
          } else if (
            this.orderForm.demandType == "purchase" ||
            this.orderForm.demandType == "finished_materials" ||
            this.orderForm.demandType == "semi_finished_materials"
          ) {
            if (res.data.records.length > 0) {
              res.data.records.forEach((item) => {
                if (
                  Number(item.issuedQuantity) >= Number(item.outputQuantity)
                ) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });
            }
            this.purchaseData = res.data.records;
          } else if (this.orderForm.demandType == "out") {
            if (res.data.records.length > 0) {
              res.data.records.forEach((item) => {
                if (
                  Number(item.issuedQuantity) >= Number(item.outputQuantity)
                ) {
                  item.disabled = true;
                } else {
                  item.disabled = false;
                }
              });
            }
            this.outData = res.data.records;
          }
          this.total = res.data.total;
          this.listLoading = false;
          this.visible = false;
        })
        .catch(() => {
          this.listLoading = false;
        });
    },

    search() {
      this.dataFormSubmit();
    },
    reset() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      this.$refs["tableDataAss"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      this.$refs["tableDataAsss"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      this.createTimeArr = [];
      this.deliveryDateArr = [];
      let demandType = "";
      if (this.activeName == "produce") {
        demandType = "produce";
      } else if (this.activeName == "purchase") {
        demandType = "purchase";
      } else if (this.activeName == "out") {
        demandType = "out";
      }
      this.orderForm = {
        demandType: demandType,
        documentStatus: "submit",
        demandState: "not_finish",
        planNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        originNo: "",
        workOrderNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        replaceStatus: "",
        immediatelyBuyFlag: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 100,
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
      };

      this.search();
    },
    clear() {
      this.$refs["dataTable"].$refs.JNPFTable.clearSort(); // 清除排序箭头高亮
      this.createTimeArr = [];
      this.deliveryDateArr = [];
      this.orderForm = {
        demandType: "produce",
        documentStatus: "submit",
        demandState: "not_finish",
        planNo: "",
        productCode: "",
        productName: "",
        productDrawingNo: "",
        immediatelyBuyFlag: "",
        originNo: "",
        workOrderNo: "",
        deliveryStartDate: "",
        deliveryEndDate: "",
        replaceStatus: "",
        startTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 100,
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
      };
    },
    addSupplier(id, btntype) {
      console.log(id, btntype);
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id, btntype);
      });
    },
    allocateOrders(id, btntype) {
      this.formVisible = true;
      if (id) {
        console.log(id);
        // setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.Form.init(id, btntype);
        });
        // }, 600);
      }
    },
    handleDel(row) {
      if (this.activeName == "produce") {
        if (this.orderDetailData.length == 1) {
          this.productVisible = false;
        } else {
        }
        console.log("row", row);
        this.orderDetailData.splice(row.$index, 1);
        console.log("this.produceArr", this.produceArr);
        this.produceArr = this.produceArr.filter(
          (item) =>
            item.bussinessCode !== row.row.bussinessCode ||
            item.productsId !== row.row.productsId ||
            item.cooperativePartnerId !== row.row.cooperativePartnerId
        );
        this.produceArr.forEach((item, index) => {
          item.materialDemandId = item.id;
          this.produceArrList[index].materialDemandId = item.id;
          item.insertOrderFlag = false;
          item.insertOrderSort = "";
          item.outputQuantity = Number(item.outputQuantity);
          item.issuedQuantity = Number(item.issuedQuantity);
          item.issuingQuantity = Number(item.issuingQuantity);
          this.produceArrList[index].productionQuantity =
            item.productionQuantity =
            item.outputQuantity - item.issuedQuantity - item.issuingQuantity;
          item.productionQuantity = item.productionQuantity =
            item.outputQuantity - item.issuedQuantity - item.issuingQuantity;
        });
        console.log("this.produceArr", this.produceArr);
        this.produceArrList = JSON.parse(JSON.stringify(this.produceArr));
        this.$forceUpdate();
      }
      if (this.activeName == "purchase") {
        if (this.orderDetailData.length == 1) {
          this.productVisible = false;
        } else {
        }
        this.orderDetailData.splice(row.$index, 1);
        this.purchaseArr = this.purchaseArr.filter(
          (item) => item.productCode !== row.row.productCode
        );
        this.$forceUpdate();
      }
      if (this.activeName == "out") {
        if (this.orderDetailData.length == 1) {
          this.productVisible = false;
        } else {
        }
        this.orderDetailData.splice(row.$index, 1);
        this.outArr = this.outArr.filter(
          (item) => item.productsId !== row.row.productsId
        );
        this.outArrList = JSON.parse(JSON.stringify(this.outArr));

        this.$forceUpdate();
      }
    },
    handleUserRelation(id, btnType) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.Form.init(id, btnType);
      });
    },
  },
};
</script>
<style scoped>
.el-tab-pane {
  height: calc(100% - 10px);
}

::v-deep .el-tabs__content {
  height: calc(100% - 40px);
}

.el-tabs {
  height: 100%;
}

.el-tabs__nav-scroll {
  padding-left: 10px;
}

.JNPF-common-head {
  padding: 10px;
}

.JNPF-common-search-box {
  padding-top: 5px;
  padding-bottom: 10px;
  margin-bottom: 5px;
}

.JNPF-common-search-box .el-form-item {
  margin-bottom: 0px !important;
}

.pagination-container {
  background-color: #ebeef5;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.main {
  padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
  margin-bottom: 0;
  padding-left: 10px !important;
  background: #fff;
}

.el-button--small {
  padding: 1;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.JNPF-common-layout-center .JNPF-common-layout-main {
  padding-bottom: 0;
}

.required {
  color: red;
  margin-right: 4px;
}

::v-deep .el-dialog .el-dialog__body {
  padding: 30px 20px !important;
}
</style>
