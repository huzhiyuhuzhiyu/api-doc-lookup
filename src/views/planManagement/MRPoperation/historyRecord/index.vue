<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main" v-if="!formVisible">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="组装需求" name="assemble">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>
                <template v-for="item in searchList1">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="getassembleData('basic')" />

                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                        clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                          :value="item2.value"></el-option>
                      </el-select>
                      <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                        :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                        :type="item.dateType"
                        :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>


                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="planDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getassembleData('basic')">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetAssembleData()">{{
                      $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <div>

                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="advancedQueryFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('assembleRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getassembleData('basic')" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="assembleRef" :data="assembleData" :fixedNO="true" v-if="isProjectSwitchFlag"
                @sort-change="sortChange" custom-column :setColumnDisplayList="columnList1"
                :checkSelectable="disproduceData" :key="1" customKey="JNPFTableKey_587408">
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="320" sortable="custom" />
                <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" v-if="isPairingModeSwitch === '1'" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
            <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
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
                <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'sale'" />
                <el-table-column label="操作" width="120" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      @click.native="complateSetFun(scope.row.bomId, 'assemble')">查看子件</el-button>

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

                <template v-for="item in searchList2">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="getproduceData('basic')" />

                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                        clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                          :value="item2.value"></el-option>
                      </el-select>
                      <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                        :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                        :type="item.dateType"
                        :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="planDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getproduceData('basic')">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProduceData()">{{
                      $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <div>

                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="advancedQueryFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('produceRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getproduceData('basic')" />
                  </el-tooltip>
                </div>
              </div>
              <JNPF-table ref="produceRef" :data="produceData" :fixedNO="true" v-if="isProjectSwitchFlag"
                :setColumnDisplayList="columnList2" @sort-change="sortChange" custom-column :key="2"
                :checkSelectable="disproduceData" customKey="JNPFTableKey_578483">
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="170" sortable="custom" />
                <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
                <el-table-column prop="pairingModeName" label="配对方式" width="160" sortable="custom" v-if="isPairingModeSwitch === '1'" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
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
                <el-table-column prop="planNo" label="计划单号" min-width="200" sortable="custom" />
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
                      @click.native="complateSetFun(scope.row.bomId, 'produce')">查看子件</el-button>

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
                <template v-for="item in searchList3">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="getpurchaseData('basic')" />

                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                        clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                          :value="item2.value"></el-option>
                      </el-select>
                      <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                        :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                        :type="item.dateType"
                        :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="4">
                  <el-form-item>
                    <el-select v-model="purchaseForm.immediatelyBuyFlag" placeholder="立即采购" clearable
                      style="width: 100%;">
                      <el-option v-for="(item, index) in immediatelyBuyFlagList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getpurchaseData('basic')">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetPurchaseData()">{{
                      $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <div>

                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="advancedQueryFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('purchaseRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getpurchaseData('basic')" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="purchaseRef" :data="purchaseData" :fixedNO="true" :key="3" v-if="isProjectSwitchFlag"
                :setColumnDisplayList="columnList3" @sort-change="sortChange" custom-column
                :checkSelectable="dispurchaseData" customKey="JNPFTableKey_347222">
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" width="170" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
                <AttributeDictionaryLine :isSlot="false" :btnType="btnType" :dataType="'line'" :moduleConfig="'sale'" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
                <el-table-column prop="immediatelyBuyFlag" label="立即采购" width="140" sortable="custom">
                  <template slot-scope="scope">
                    <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planNo" label="计划单号" min-width="170" sortable="custom" />
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
                <el-table-column label="操作" width="120" fixed="right">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text"
                      :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag"
                      @click.native="retrospectFun(scope.row.id, 'purchase')">追溯主产品</el-button>
                  </template>

                </el-table-column>
              </JNPF-table>
              <pagination :total="total3" :page.sync="purchaseForm.pageNum" :limit.sync="purchaseForm.pageSize"
                @pagination="getpurchaseData">
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
                <template v-for="item in searchList4">
                  <el-col :span="item.searchType === 3 ? 6 : 4">
                    <el-form-item>
                      <el-input v-if="item.searchType === 1" v-model="item.fieldValue" :placeholder="item.label"
                        clearable @keyup.enter.native="getouteData('basic')" />

                      <el-select v-else-if="item.searchType === 4" v-model="item.fieldValue" :placeholder="item.label"
                        clearable>
                        <el-option v-for="(item2, index2) in item.options" :key="index2" :label="item2.label"
                          :value="item2.value"></el-option>
                      </el-select>
                      <el-date-picker v-else-if="item.searchType === 3" v-model="item.fieldValue"
                        :start-placeholder="item.label + '开始'" :end-placeholder="item.label + '结束'" clearable
                        :type="item.dateType"
                        :value-format="item.dateType === 'daterange' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </template>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="getouteData('basic')">
                      {{ $t("common.search") }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetOuData()">{{ $t("common.reset") }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main" v-loading="listLoading">
              <div class="JNPF-common-head">
                <div>
                </div>
                <div class="JNPF-common-head-right">
                  <el-tooltip content="高级查询" placement="top">
                    <el-link icon="icon-ym icon-ym-filter JNPF-common-head-icon" :underline="false"
                      @click="advancedQueryFun" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                    <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                      @click="columnSetFun('outRef')" />
                  </el-tooltip>
                  <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                    <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                      @click="getouteData('basic')" />
                  </el-tooltip>
                </div>
              </div>

              <JNPF-table ref="outRef" :data="outData" :fixedNO="true" @sort-change="sortChange"
                v-if="isProjectSwitchFlag" :key="4" :setColumnDisplayList="columnList4" custom-column
                :checkSelectable="disOutData" customKey="JNPFTableKey_762514">
                <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" width="180" sortable="custom" />
            <el-table-column prop="productCategoryName" label="产品分类" width="160" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
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
                <el-table-column prop="planNo" label="计划单号" min-width="170" sortable="custom" />
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
                      @click.native="complateSetFun(scope.row.bomId, 'out')">查看子件</el-button>

                  </template>
                </el-table-column>
              </JNPF-table>
              <pagination :total="total4" :page.sync="outForm.pageNum" :limit.sync="outForm.pageSize"
                @pagination="getouteData">
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

    <SuperQuery :show="superQueryVisible" ref="SuperQuery" :columnOptions="superQueryJson"
      @superQuery="superQuerySearch" @close="superQueryVisible = false" />
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

import { getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap } from "@/api/masterDataManagement/index";
import Form from "./Form";
import ComplateSetForm from "./complateSetForm";
import moment from "moment";
import RetrospectForm from '../materialRequirements/retrospectForm.vue'
import SuperQuery from '@/components/SuperQuery/index.vue'
import { index } from 'mathjs';
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  name: "historyRecord",
  components: { Form, ComplateSetForm, SuperQuery, RetrospectForm },
  mixins: [getProjectList],
  data() {
    return {
      listLoading: false,
      superQuery1: {},
      superForm1: {},
      basicQuery1: {},
      searchList1: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQuery2: {},
      superForm2: {},
      basicQuery2: {},
      searchList2: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQuery3: {},
      superForm3: {},
      basicQuery3: {},
      searchList3: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQuery4: {},
      superForm4: {},
      basicQuery4: {},
      searchList4: [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ],
      superQueryVisible: false,

      columnList1: ["productCode", "planNo", "planEndDate"],
      columnList2: ["productCode", "planNo", "planEndDate"],
      columnList3: ["productCode", "planNo", "planEndDate"],
      columnList4: ["productCode", "planNo", "planEndDate"],
      total1: 0,
      assembleForm: {
        demandType: "assemble",
        demandState: "finished",
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
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
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
        demandState: "finished",
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
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
      },
      immediatelyBuyFlagList: [{ label: "是", value: true }, { label: "否", value: false }],
      purchaseForm: {
        productDrawingNo: "",
        planNo: "",
        immediatelyBuyFlag: "",
        demandType: "purchase",
        demandState: "finished",
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
      },
      outForm: {
        demandType: "out",
        demandState: "finished",
        documentStatus: "submit",
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
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
      },
      assembleNum: 0,//组装数量
      totalDemandQuantity: 0,//需求数量
      outputQuantity: 0,//需组装/生产/采购/外协数量
      lossNum: 0,//损耗数量
      planInTransitQuantity: 0,//计划在制在途数量
      inTransitUnOccupancyQuantity: 0,//实际在制在途数量
      occupancyQuantity: 0,//当前预占数量

      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      isProductNameSwitch: "",
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag:'',
      colourFlag:'',
      bimProductAttributesList: [],
      superQueryJson: [],
      isPairingModeSwitch: '', // 配对方式显示隐藏
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    produceArr: {
      handler: function (newValue) {
        console.log(888, newValue);
      },
      deep: true,
    },
  },
  async created() {
    await this.getProductClassFun()
    await this.getProjectSwitch('system', 'project')
    await this.getPairingModeSwitch('product', 'enable_show_pairing_mode') // 配对方式显示隐藏
    this.superForm1 = this.assembleForm
    this.getassembleData('basic');
    await this.getProductNameSwitch('product', 'enable_productName')
    if (this.isProductNameSwitch == 1) {

      this.searchList1.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
      this.searchList2.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
      this.searchList3.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)
      this.searchList4.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)

    }
  },
  methods: {
     // 配对方式显示隐藏
     async getPairingModeSwitch(code, type) {
      try {
        this.isPairingModeSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.tableDataFlag = true
      } catch (error) { }
    },
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })

    },
    advancedQueryFuns() {
      // sealingCoverTyping //打字内容
      //     accuracyLevel //精度等级
      //     vibrationLevel //振动等级
      //     oil //油脂
      //     oilQuantity //油脂量
      //     clearance //游隙
      //     packagingMethod //包装方式
      //     specialRequire //特殊要求
      //     material // 保持架材质
      //     colour  //  颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'mainUnit')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.specialRequireFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'specialRequire',
          label: '特殊要求',
          type: 'select',
          options: this.bimProductAttributesList.pa016.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.packagingMethodFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'packagingMethod',
          label: '包装方式',
          type: 'select',
          options: this.bimProductAttributesList.pa015.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.clearanceFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'clearance',
          label: '游隙',
          type: 'select',
          options: this.bimProductAttributesList.pa001.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilQuantityFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oilQuantity',
          label: '油脂量',
          type: 'select',
          options: this.bimProductAttributesList.pa003.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.oilFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'oil',
          label: '油脂',
          type: 'select',
          options: this.bimProductAttributesList.pa002.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.vibrationLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'vibrationLevel',
          label: '振动等级',
          type: 'select',
          options: this.bimProductAttributesList.pa005.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.accuracyLevelFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'accuracyLevel',
          label: '精度等级',
          type: 'select',
          options: this.bimProductAttributesList.pa006.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.sealingCoverTypingFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'sealingCoverTyping',
          label: '打字内容',
          type: 'select',
          options: this.bimProductAttributesList.pa007.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
    },
    advancedQueryFunsPurchase() {
      //     material // 保持架材质
      //     colour  //  颜色
      let classIndex = this.superQueryJson.findIndex((obj) => obj.prop === 'productDrawingNo')
      if (this.colourFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'colour',
          label: '颜色',
          type: 'select',
          options: this.bimProductAttributesList.pa010.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
      if (this.materialFlag === '1') {
        this.superQueryJson.splice(classIndex + 1, 0, {
          prop: 'material',
          label: '保持架材质',
          type: 'select',
          options: this.bimProductAttributesList.pa021.map((item) => {
            return {
              label: item.name,
              value: item.name
            }
          })
        })
      }
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },

    superQuerySearch(query) {

      if (this.activeName == 'assemble') {
        this.assembleForm.superQuery = query
        this.superQueryVisible = false
        this.getassembleData()
      }
      if (this.activeName == 'produce') {
        this.produceForm.superQuery = query
        this.superQueryVisible = false
        this.getproduceData()
      }
      if (this.activeName == 'purchase') {
        this.purchaseForm.superQuery = query
        this.superQueryVisible = false
        this.getpurchaseData()
      }
      if (this.activeName == 'out') {
        this.outForm.superQuery = query
        this.superQueryVisible = false
        this.getouteData()
      }
    },
    // 高级查询
    advancedQueryFun() {
      if (this.activeName == 'assemble') {
        this.superQueryJson = [
          {
            prop: 'productCode',
            label: "产品编码",
            type: 'input'
          },
          {
            prop: 'productDrawingNo',
            label: "品名规格",
            type: 'input'
          },
          {
            prop: 'bomFlag',
            label: "是否有BOM",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },
          {
            prop: 'immediatelyBuyFlag',
            label: "立即组装",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },

          {
            prop: 'planNo',
            label: "计划单号",
            type: 'input',
          },
          {
            prop: 'mainUnit',
            label: "单位",
            type: 'input',
          },
          {
            prop: 'planStartDate',
            label: '计划开始日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'planEndDate',
            label: '计划结束日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },


        ]

        this.superQueryVisible = true
        this.advancedQueryFuns()
        setTimeout(() => {
          this.getProductClassFun()
        }, 1000);
      }
      if (this.activeName == 'produce') {
        this.superQueryJson = [
          {
            prop: 'productCode',
            label: "产品编码",
            type: 'input'
          },
          {
            prop: 'productDrawingNo',
            label: "品名规格",
            type: 'input'
          },
          {
            prop: 'bomFlag',
            label: "是否有BOM",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },
          {
            prop: 'immediatelyBuyFlag',
            label: "立即生产",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },
          {
            prop: 'planNo',
            label: "计划单号",
            type: 'input',
          },
          {
            prop: 'mainUnit',
            label: "单位",
            type: 'input',
          },

          {
            prop: 'planStartDate',
            label: '计划开始日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'planEndDate',
            label: '计划结束日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },




        ]
        this.superQueryVisible = true
      }
      if (this.activeName == 'purchase') {
        this.superQueryJson = [
          {
            prop: 'productCode',
            label: "产品编码",
            type: 'input'
          },
          {
            prop: 'productDrawingNo',
            label: "品名规格",
            type: 'input'
          },
          {
            prop: 'immediatelyBuyFlag',
            label: "立即采购",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },
          {
            prop: 'planNo',
            label: "计划单号",
            type: 'input',
          },
          {
            prop: 'mainUnit',
            label: "单位",
            type: 'input',
          },
          {
            prop: 'planStartDate',
            label: '计划开始日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'planEndDate',
            label: '计划结束日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },







        ]
        this.advancedQueryFunsPurchase()
        this.superQueryVisible = true
      }
      if (this.activeName == 'out') {
        this.superQueryJson = [
          {
            prop: 'productCode',
            label: "产品编码",
            type: 'input'
          },
          {
            prop: 'productDrawingNo',
            label: "品名规格",
            type: 'input'
          },
          {
            prop: 'bomFlag',
            label: "是否有BOM",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },
          {
            prop: 'immediatelyBuyFlag',
            label: "立即外协",
            type: 'select',
            options: [
              { label: "是", value: true },
              { label: "否", value: false },
            ]
          },
          {
            prop: 'planNo',
            label: "计划单号",
            type: 'input',
          },
          {
            prop: 'mainUnit',
            label: "单位",
            type: 'input',
          },

          {
            prop: 'planStartDate',
            label: '计划开始日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },
          {
            prop: 'planEndDate',
            label: '计划结束日期',
            type: 'daterange',
            valueFormat: "yyyy-MM-dd",
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            pickerOptions: this.global.timePickerOptions
          },







        ]
        this.superQueryVisible = true
      }
      if (this.isProductNameSwitch == 1) {
        this.superQueryJson.splice(1, 0, {
          prop: 'productName',
          label: '产品名称',
          type: 'input'
        })
      }
    },
    // table切换
    handleClick() {
      console.log(this.activeName);
      if (this.activeName == "assemble") {
        this.planDateArr = []
        this.assembleForm.productDrawingNo = ""
        this.assembleForm.planNo = ""
        this.superForm1 = this.assembleForm
        this.getassembleData('basic')
      }
      if (this.activeName == "produce") {
        this.planDateArr = []
        this.produceForm.productDrawingNo = ""
        this.produceForm.planNo = ""
        this.superForm2 = this.produceForm
        this.getproduceData('basic')

      }
      if (this.activeName == "purchase") {
        this.purchaseForm.productDrawingNo = ""
        this.purchaseForm.planNo = ""
        this.superForm3 = this.purchaseForm
        this.getpurchaseData('basic')

      }
      if (this.activeName == "out") {
        this.outForm.productDrawingNo = ""
        this.outForm.planNo = ""
        this.planDateArr = []
        this.superForm4 = this.outForm
        this.getouteData('basic')

      }
    },


    // 齐套查询
    QTsearch(data, type) {

    },
    // 组装列表数据
    getassembleData(type) {
      if (this.planDateArr.length) {
        this.assembleForm.planSsd = this.planDateArr[0]
        this.assembleForm.planSed = this.planDateArr[1]
      } else {
        this.assembleForm.planSsd = ""
        this.assembleForm.planSed = ""
      }
      if (type === 'basic') {
        this.basicQuery1 = {
          matchLogic: 'AND',
          condition: this.searchList1
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm1.superQuery = this.basicQuery1
      }
      if (type === 'super') {
        this.superForm1.superQuery = this.superQuery1
      }
      this.superForm1.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.listLoading = true
      getMaterialDemandReport(this.superForm1).then(res => {
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
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    resetAssembleData() {
      this.planDateArr = []
      this.superForm1 = this.assembleForm = {
        demandType: "assemble",
        demandState: "finished",
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
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
      }
      this.searchList1 = [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      if (this.isProductNameSwitch == 1) {

        this.searchList1.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)

      }
      this.$refs.SuperQuery.conditionList = []
      this.getassembleData('basic')
    },
    // 生产列表数据
    getproduceData(type) {
      console.log("type", type);
      if (this.planDateArr.length) {
        this.produceForm.planSsd = this.planDateArr[0]
        this.produceForm.planSed = this.planDateArr[1]
      } else {
        this.produceForm.planSsd = ""
        this.produceForm.planSed = ""
      }
      if (type === 'basic') {
        this.basicQuery2 = {
          matchLogic: 'AND',
          condition: this.searchList2
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm2.superQuery = this.basicQuery2
      }
      if (type === 'super') {
        this.superForm2.superQuery = this.superQuery2
      }
      this.superForm2.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.listLoading = true
      getMaterialDemandReport(this.superForm2).then(res => {
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
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    resetProduceData() {
      this.planDateArr = []
      this.superForm2 = this.produceForm = {
        demandType: "produce",
        demandState: "finished",
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
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
      },
        this.$refs.SuperQuery.conditionList = []
      this.searchList2 = [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      if (this.isProductNameSwitch == 1) {

        this.searchList2.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)

      }
      this.getproduceData('basic')
    },
    // 采购列表数据
    getpurchaseData(type) {
      if (type === 'basic') {
        this.basicQuery3 = {
          matchLogic: 'AND',
          condition: this.searchList3
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm3.superQuery = this.basicQuery3
      }
      if (type === 'super') {
        this.superForm3.superQuery = this.superQuery3
      }
      this.superForm3.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.listLoading = true
      getMaterialDemandReport(this.superForm3).then(res => {
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
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    resetPurchaseData() {
      this.superForm3 = this.purchaseForm = {
        productDrawingNo: "",
        planNo: "",
        immediatelyBuyFlag: "",
        demandType: "purchase",
        demandState: "finished",
        documentStatus: "submit",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        superQuery: {
          condition: [],
          matchLogic: ""
        },
        pageNum: 1,
        pageSize: 20,
      },

        this.$refs.SuperQuery.conditionList = []
      this.searchList3 = [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      if (this.isProductNameSwitch == 1) {

        this.searchList3.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)

      }
      this.getpurchaseData('basic')
    },
    // 外协列表数据
    getouteData(type) {
      if (this.planDateArr.length) {
        this.outForm.planSsd = this.planDateArr[0]
        this.outForm.planSed = this.planDateArr[1]
      } else {
        this.outForm.planSsd = ""
        this.outForm.planSed = ""
      }
      if (type === 'basic') {
        this.basicQuery4 = {
          matchLogic: 'AND',
          condition: this.searchList4
            .filter((item) => item.fieldValue)
            .map((item) => {
              return {
                ...item,
                fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : item.fieldValue
              }
            })
        }
        this.superForm4.superQuery = this.basicQuery4
      }
      if (type === 'super') {
        this.superForm4.superQuery = this.superQuery4
      }
      this.superForm4.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.listLoading = true
      getMaterialDemandReport(this.superForm4).then(res => {
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
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    resetOuData() {
      this.planDateArr = []
      this.superForm4 = this.outForm = {
        demandType: "out",
        demandState: "finished",
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
        pageNum: 1,
        pageSize: 20,
        superQuery: {
          condition: [],
          matchLogic: ""
        },
      }
      this.searchList4 = [
        { field: 'productDrawingNo', fieldValue: '', label: '品名规格', symbol: 'like', searchType: 1, width: 120 },
        { field: 'planNo', fieldValue: '', label: '计划单号', symbol: 'like', searchType: 1, width: 120 },
      ]
      if (this.isProductNameSwitch == 1) {
        this.searchList4.splice(1, 0, { field: 'productName', fieldValue: '', label: '产品名称', symbol: 'like', searchType: 1, width: 120 },)

      }
      this.$refs.SuperQuery.conditionList = []
      this.getouteData('basic')
    },
    sortChange({ prop, order }) {
      console.log("prop", prop);
      let newProp;
      if (
        prop === "productCode" ||prop=='pairingModeName'||
        prop === "productName" ||
        prop === "productDrawingNo" ||
        prop === "routingName" ||
        prop === "routingCode" || prop == 'projectName'
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
      this.$refs[ref].showDrawer()

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
  padding: 8px 0 !important;
  margin-left: 0 !important;
  padding-top: 0px !important;
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

::v-deep .el-tabs__item {
  padding: 0 10px;
}
</style>
