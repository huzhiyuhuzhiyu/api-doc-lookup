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

                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="assembleForm.planNo" placeholder="计划单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="planDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getassembleData()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAssembleData()">{{
                      $t("common.reset") }}
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
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('assembleRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getassembleData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="assembleRef" v-loading="listLoading" :data="assembleData" :fixedNO="true"
                @sort-change="sortChange" custom-column hasC @selection-change="handleProduce"
                :setColumnDisplayList="columnList1" :checkSelectable="disproduceData">
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="320" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="bomId" label="是否有BOM" min-width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div :style="scope.row.bomId ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomId ? "有" : '否'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="immediatelyBuyFlag" label="立即组装" min-width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planNo" label="计划单号" width="180" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" min-width="80" />
                <el-table-column prop="outputQuantity" label="需组装数量" min-width="160" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="180" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" sortable="custom" />
                <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" sortable="custom" />
                <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" sortable="custom" />
                <el-table-column prop="oil" label="油脂" min-width="100" sortable="custom" />
                <el-table-column prop="oilQuantity" label="油脂量" min-width="120" sortable="custom" />
                <el-table-column prop="clearance" label="游隙" min-width="100" sortable="custom" />
                <el-table-column prop="packagingMethod" label="包装方式" min-width="120" sortable="custom" />
                <el-table-column prop="specialRequire" label="特殊要求" min-width="120" sortable="custom" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      @click.native="complateSetFun(scope.row.id, 'assemble')">齐套查询</el-button>

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
                    <el-date-picker v-model="planDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getproduceData()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProduceData()">{{
                      $t("common.reset") }}
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
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('produceRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getproduceData()" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="produceRef" v-loading="listLoading" :data="produceData" :fixedNO="true"
                :setColumnDisplayList="columnList2" @sort-change="sortChange" custom-column hasC
                @selection-change="handleProduce" :checkSelectable="disproduceData">
                <el-table-column prop="productDrawingNo" label="品名规格" width="170" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM" :
                      '无BOM'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="immediatelyBuyFlag" label="立即生产" width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="safeInventory" label="安全库存" min-width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.safeInventory ? scope.row.safeInventory : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" min-width="120" sortable="custom" />
                <el-table-column prop="lossNum" label="损耗数量" min-width="120" sortable="custom" />
                <el-table-column prop="planInTransitQuantity" label="计划在制数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.planInTransitQuantity ? scope.row.planInTransitQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="inTransitUnOccupancyQuantity" label="实际在制数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="occupancyQuantity" label="占用数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outputQuantity" label="需生产数量" min-width="140" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />

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
                @pagination="getproduceData">
                <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">损耗数量：{{ lossNum }}</span>
                  <span style="font-weight:500;margin-right:10px">计划在制数量：{{ planInTransitQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">实际在制数量：{{ inTransitUnOccupancyQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">当前预占数量：{{ occupancyQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">需生产数量：{{ outputQuantity }}</span>
                </div>
              </pagination>
            </div>

          </div>
        </el-tab-pane>
        <el-tab-pane label="采购需求" name="purchase">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="purchaseForm.productDrawingNo" placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="purchaseForm.immediatelyBuyFlag" placeholder="立即采购" clearable
                      style="width: 100%;">
                      <el-option v-for="(item, index) in immediatelyBuyFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="purchaseForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>


                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getpurchaseData()">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetPurchaseData()">{{
                      $t("common.reset") }}
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
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('purchaseRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="purchaseRef" v-loading="listLoading" :data="purchaseData" :fixedNO="true"
                :setColumnDisplayList="columnList3" @sort-change="sortChange" custom-column hasC
                @selection-change="handlePurchase" :checkSelectable="dispurchaseData">
                <el-table-column prop="productDrawingNo" label="品名规格" width="170" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="immediatelyBuyFlag" label="立即采购" width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="safeInventory" label="安全库存" min-width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.safeInventory ? scope.row.safeInventory : 0 }}</div>
                  </template>
                </el-table-column>

                <el-table-column prop="inventoryQuantity" label="库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" min-width="120" sortable="custom" />
                <el-table-column prop="lossNum" label="损耗数量" min-width="120" sortable="custom" />
                <el-table-column prop="planInTransitQuantity" label="计划在途数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.planInTransitQuantity ? scope.row.planInTransitQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="inTransitUnOccupancyQuantity" label="实际在途数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="occupancyQuantity" label="当前预占数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outputQuantity" label="需采购数量" min-width="140" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                <el-table-column label="操作" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag"
                      @click.native="retrospectFun(scope.row.id, 'purchase')">追溯主产品</el-button>
                  </template>

                </el-table-column>
              </JNPF-table>
              <pagination :total="total3" :page.sync="purchaseForm.pageNum" :limit.sync="purchaseForm.pageSize"
                @pagination="initData">
                <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">损耗数量：{{ lossNum }}</span>
                  <span style="font-weight:500;margin-right:10px">计划在途数量：{{ planInTransitQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">实际在途数量：{{ inTransitUnOccupancyQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">当前预占数量：{{ occupancyQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">需采购数量：{{ outputQuantity }}</span>
                </div>
              </pagination>
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
                    <el-input v-model="outForm.planNo" placeholder="计划单号" clearable />
                  </el-form-item>
                </el-col>

              
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="outForm.productDrawingNo" placeholder="品名规格" clearable />
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
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('outRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="initData()" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="outRef" v-loading="listLoading" :data="outData" :fixedNO="true" @sort-change="sortChange"
                :setColumnDisplayList="columnList4" custom-column hasC @selection-change="handleOut"
                :checkSelectable="disOutData">
                <el-table-column prop="productDrawingNo" label="品名规格" width="180" sortable="custom" />
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM" :
                      '无BOM'
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="immediatelyBuyFlag" label="立即外协" width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" width="80" />
                <el-table-column prop="safeInventory" label="安全库存" min-width="120" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.safeInventory ? scope.row.safeInventory : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="inventoryQuantity" label="库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inventoryQuantity ? scope.row.inventoryQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="availableQuantity" label="可用库存数量" width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.availableQuantity ? scope.row.availableQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="demandQuantity" label="需求数量" min-width="120" sortable="custom" />
                <el-table-column prop="lossNum" label="损耗数量" min-width="120" sortable="custom" />
                <el-table-column prop="planInTransitQuantity" label="计划在制数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.planInTransitQuantity ? scope.row.planInTransitQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="inTransitUnOccupancyQuantity" label="实际在制数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="occupancyQuantity" label="占用数量" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="outputQuantity" label="需外协数量" min-width="140" sortable="custom" />
                <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />

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
                @pagination="initData">
                <div style="background: #f5f7fa;text-align:end" class="text">
                  <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">损耗数量：{{ lossNum }}</span>
                  <span style="font-weight:500;margin-right:10px">计划在制数量：{{ planInTransitQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">实际在制数量：{{ inTransitUnOccupancyQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">当前预占数量：{{ occupancyQuantity }}</span>
                  <span style="font-weight:500;margin-right:10px">需外协数量：{{ outputQuantity }}</span>
                </div>
              </pagination>
            </div>

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <Form v-if="formVisible" ref="Form" @refreshDataList="initData" @close="closeForm" />

    <el-dialog :title="'物料下达'" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="productVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center wlxd" width="1200px">

      <JNPF-table ref="tableDataAss" v-loading="listLoading" :data="orderDetailData" style="margin-top: 20px" height="600"
        hasC @selection-change="selectInsertOrderFun">
        <el-table-column prop="productionPlanNo" label="生产计划单号" width="180" v-if="activeName != 'purchase' && activeName != 'out'"></el-table-column>
        <el-table-column prop="productDrawingNo" label="品名规格" min-width="460" />
        <el-table-column prop="productCode" label="产品编码" min-width="460" />
        <el-table-column prop="outputQuantity" label="组装数量" min-width="460" v-if="activeName == 'assemble'" />

        <el-table-column prop="outputQuantity" label="生产数量" width="100" v-if="activeName == 'produce'" />
        <el-table-column prop="outputQuantity" label="采购数量" width="100" v-if="activeName == 'purchase'" />
        <el-table-column prop="outputQuantity" label="外协数量" width="100" v-if="activeName == 'out'" />
        <el-table-column prop="planProductionQuantity" label="下达数量" width="120" v-if="activeName == 'produce'||activeName == 'assemble'"
          fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.planProductionQuantity" :disabled="activeName == 'assemble'"  >{{ scope.row.planProductionQuantity }}</el-input>
          </template>
        </el-table-column>
        <el-table-column prop="planDemandQuantity" label="下达数量" width="120" v-if="activeName == 'purchase'||activeName == 'out'"
          fixed="right">
          <template slot="header">
            <span class="required">*</span>下达数量
          </template>
          <template slot-scope="scope">
            <el-input v-model="scope.row.planDemandQuantity"  >{{ scope.row.planDemandQuantity }}</el-input>planDemandQuantity
          </template>
        </el-table-column>
        <el-table-column prop="urgentFlag" :key="5" label="是否插单(紧急)" min-width="180" fixed="right" v-if="activeName == 'produce'||activeName == 'assemble'">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.urgentFlag"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="sealingCoverTyping" label="打字内容" min-width="120" v-if="activeName == 'assemble'" />
        <el-table-column prop="accuracyLevel" label="精度等级" min-width="120" v-if="activeName == 'assemble'" />
        <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" v-if="activeName == 'assemble'" />
        <el-table-column prop="oil" label="油脂" min-width="100" v-if="activeName == 'assemble'" />
        <el-table-column prop="oilQuantity" label="油脂量" min-width="120" v-if="activeName == 'assemble'" />
        <el-table-column prop="clearance" label="游隙" min-width="100" v-if="activeName == 'assemble'" />
        <el-table-column prop="packagingMethod" label="包装方式" min-width="120" v-if="activeName == 'assemble'" />
        <el-table-column prop="specialRequire" label="特殊要求" min-width="120" v-if="activeName == 'assemble'" />





        <el-table-column prop="deliveryDate" label="交货日期" width="180" fixed="right" v-if="activeName == 'purchase'||activeName == 'out'">
          <template slot="header">
            <span class="required">*</span>交货日期
          </template>
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.deliveryDate" type="date" value-format="yyyy-MM-dd" style="width: 100%"
              :disabled="activeName == 'produce'" placeholder="请选择交货日期" @change="selectDate(scope.row.deliveryDate)">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="standardValue" label="规值" width="160" v-if="activeName == 'purchase'" />
        <el-table-column prop="colour" label="颜色" width="160" v-if="activeName == 'purchase'" />

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
    </el-dialog>

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
      orderDetailData: [],
      productVisible: false,
      columnList1: ["productCode", "planNo", "sealingCoverTyping", "accuracyLevel", "vibrationLevel", "oil", "oilQuantity", "clearance", "packagingMethod", "specialRequire", "planEndDate"],
      columnList2: ["productCode", "planNo", "planEndDate"],
      columnList3: ["productCode", "planNo", "planEndDate"],
      columnList4: ["productCode", "planNo", "planEndDate"],
      total1: 0,
      assembleForm: {
        demandType: "assemble",
        demandState: "not_finish",
        documentStatus: "submit",
        productDrawingNo: "",
        planNo: "",
        planSed: "",
        planSsd: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },

      total2: 0,
      total3: 0,
      total4: 0,
      activeName: "assemble",
      assembleData: [],
      produceData: [],
      purchaseData: [],
      planDateArr: [],
      outData: [],
      complateSetFormVisible: false,
      retrospectFormVisible: false,
      produceForm: {
        demandType: "produce",
        demandState: "not_finish",
        documentStatus: "submit",
        productDrawingNo: "",
        planNo: "",
        planSed: "",
        planSsd: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      immediatelyBuyFlagList: [{ label: "是", value: true }, { label: "否", value: false }],
      purchaseForm: {
        productDrawingNo: "",
        planNo: "",
        immediatelyBuyFlag: "",
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
      allSelected: false,
      isIndeterminate: false,















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
    renderHeader(h, data) {
      return h("span", {
        style: "color:red;",
      }, [
        h("el-checkbox", {
          on: {
            change: this.selectBox
          },
          props: {
            value: this.allSelected,
            indeterminate: this.isIndeterminate
          },
          style: "color:red;"
        },
          ['*',
            h("span", { style: "color:#606266;" }, "是否插单(紧急)")
          ],
        )
      ]);
    },
    toggleCheck(row) {
      // 获取已勾选
      let list = this.orderDetailData.filter(item => item.insertOrderFlag);
      this.allSelected = list.length === this.orderDetailData.length//是否全选
      this.isIndeterminate = list.length > 0 && list.length < this.orderDetailData.length;//是否半选
    },
    handleCellClassName({ rowIndex, columnIndex }) {
      if (columnIndex === 8) {
        return {
          background: '#e73648'
        }
      }
    },
    // table切换
    handleClick() {
      console.log(this.activeName);
      if (this.activeName == "assemble") {
        this.planDateArr = []
        this.getassembleData()
      }
      if (this.activeName == "produce") {
        this.planDateArr = []
        this.getproduceData()

      }
      if (this.activeName == "purchase") {
        this.getpurchaseData()

      }
      if (this.activeName == "out") {
        this.planDateArr = []
        this.getouteData()

      }
    },


    // 齐套查询
    QTsearch(data, type) {

    },
    // 组装列表数据
    getassembleData() {
      if (this.planDateArr.length) {
        this.assembleForm.planSsd = this.planDateArr[0]
        this.assembleForm.planSed = this.planDateArr[1]
      } else {
        this.assembleForm.planSsd = ""
        this.assembleForm.planSed = ""
      }
      getMaterialDemandReport(this.assembleForm).then(res => {
        console.log("组装res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          this.total1 = res.data.page.total
          this.assembleData = tableData

          this.totalDemandQuantity = totalData.demandQuantity
          this.outputQuantity = totalData.outputQuantity
        } else {
          this.assembleData = []
          this.total1 = 0
          this.totalDemandQuantity = 0
          this.outputQuantity = 0

        }
      })
    },
    resetAssembleData() {
      this.planDateArr = []
      this.assembleForm = {
        demandType: "assemble",
        demandState: "not_finish",
        documentStatus: "submit",
        productDrawingNo: "",
        planNo: "",
        bomFlag: "",
        planSed: "",
        planSsd: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
        this.getassembleData()
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
        } else {
          this.produceData = []
          this.total2 = 0
          this.totalDemandQuantity = 0
          this.outputQuantity = 0
          this.lossNum = 0
          this.planInTransitQuantity = 0
          this.inTransitUnOccupancyQuantity = 0
          this.occupancyQuantity = 0
        }
      })
    },
    resetProduceData() {
      this.planDateArr = []
      this.produceForm = {
        demandType: "produce",
        demandState: "not_finish",
        documentStatus: "submit",
        productDrawingNo: "",
        planNo: "",
        planSed: "",
        planSsd: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
        this.getproduceData()
    },
    // 采购列表数据
    getpurchaseData() {
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

        } else {
          this.purchaseData = []
          this.total3 = 0
          this.totalDemandQuantity = 0
          this.outputQuantity = 0
          this.lossNum = 0
          this.planInTransitQuantity = 0
          this.inTransitUnOccupancyQuantity = 0
          this.occupancyQuantity = 0
        }
      })
    },
    resetPurchaseData() {
      this.purchaseForm = {
        productDrawingNo: "",
        planNo: "",
        immediatelyBuyFlag: "",
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
        this.getpurchaseData()
    },
    // 外协列表数据
    getouteData() {
      getMaterialDemandReport(this.outForm).then(res => {
        console.log("外协res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          this.outData = tableData
          this.total4 = res.data.page.total

          this.totalDemandQuantity = totalData.demandQuantity
          this.outputQuantity = totalData.outputQuantity
          this.lossNum = totalData.lossNum
          this.planInTransitQuantity = totalData.planInTransitQuantity
          this.inTransitUnOccupancyQuantity = totalData.inTransitUnOccupancyQuantity
          this.occupancyQuantity = totalData.occupancyQuantity

        } else {
          this.outData = []
          this.total4 = 0
          this.totalDemandQuantity = 0
          this.outputQuantity = 0
          this.lossNum = 0
          this.planInTransitQuantity = 0
          this.inTransitUnOccupancyQuantity = 0
          this.occupancyQuantity = 0
        }
      })
    },
    resetOuData() {
      this.planDateArr = []
      this.outForm = {
        demandType: "out",
        demandState: "not_finish",
        documentStatus: "submit",
        productDrawingNo: "",
        planNo: "",
        planSed: "",
        planSsd: "",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
        this.getouteData()
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


      if (this.activeName == "assemble") {
        this.assembleForm.orderItems[0].asc = order === "ascending";
        this.assembleForm.orderItems[0].column = order === null ? "" : newProp;
        this.getassembleData()
      }
      if (this.activeName == "produce") {
        this.produceForm.orderItems[0].asc = order === "ascending";
        this.produceForm.orderItems[0].column = order === null ? "" : newProp;
        this.getproduceData()

      }
      if (this.activeName == "purchase") {
        this.purchaseForm.orderItems[0].asc = order === "ascending";
        this.purchaseForm.orderItems[0].column = order === null ? "" : newProp;
        this.getpurchaseData()

      }
      if (this.activeName == "out") {
        this.outForm.orderItems[0].asc = order === "ascending";
        this.outForm.orderItems[0].column = order === null ? "" : newProp;
        this.getouteData()

      }
    },
    columnSetFun(ref) {
      this.$refs.ref.showDrawer()

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
  padding-top: 0px;
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
