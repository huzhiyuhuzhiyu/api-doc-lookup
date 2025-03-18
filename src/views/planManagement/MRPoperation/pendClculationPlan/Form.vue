<template>
  <transition name="el-zoom-in-center">

    <div class="JNPF-preview-main org-form">
      <div class="JNPF-full-dialog-header">
        <div class="header-title">

          <!-- <img src="@/assets/images/jnpf.png" class="header-logo" /> -->
          <h2 class="header-txt" style="font-size: 24px;font-weight: 700;"> MRP计算</h2>
        </div>
        <el-steps :active="activeStep" finish-status="success" simple s v-if="!loading">
          <el-step title="计算公式及需求范围" @click.native="stepChick(0)" />
          <el-step title="执行计算并查看结果" @click.native="stepChick(1)" />
          <el-step title="提交运算结果并下达" @click.native="stepChick(2)" />
        </el-steps>
        <div class="options">
          <el-button type="primary" size="mini" @click="next" :loading="btnLoading" :disabled="activeStep == 1 || loading"
            v-if="activeStep == 0">执行计算 </el-button>
          <el-button size="mini" @click="prev" :disabled="activeStep <= 0" v-if="activeStep > 0 && activeStep != 2">{{
            $t('common.prev')
          }}</el-button>
          <el-button size="mini" type="primary" @click="dataFormSubmit()" :loading="btnLoading"
            v-if="activeStep == 1">提交</el-button>
          <el-button size="mini" type="primary" @click="allIssueFun()" :loading="btnLoading"
            v-if="activeStep == 2">全部下达</el-button>
          <el-button size="mini" @click="closeDialog()">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div style="height: 1px;width: 100%;background-color: #E4E7ED;margin-top: 7px"></div>
      <div class="main" v-loading="loading">
        <el-collapse v-model="activeNames" v-if="!activeStep" style="height: 100%;background-color: #fff;">
          <el-collapse-item title="运算公式" name="basicInfo" class="orderInfo">
            <el-form ref="dataForm" :model="dataForm" label-width="120px" label-position="left">
              <el-row style="height: 100%;">
                <el-col :span="10">
                  <el-form-item label="运算单号">
                    <el-input v-model="dataForm.arithmeticNo" placeholder="运算单号" style="width: auto;" clearable
                      :disabled="codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false" />
                  </el-form-item>

                </el-col>
                <el-col :span="12" v-if="isProjectSwitch == 1">
                  <el-form-item label="所属项目" prop="projectId">
                    <el-select v-model="dataForm.projectId" placeholder="请选择所属项目" clearable style="width: auto;"
                      :disabled="userInfo.projectId != '1'" @change="changeProject">
                      <el-option v-for="(item, index) in projectIdDataList" :key="index" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="计算方案">
                    <div>
                      <el-select v-model="dataForm.schemeNames" placeholder="请选择计算方案" @change="selectsChemeFun">
                        <el-option :key="item.id" :label="item.schemeName" :value="item.id"
                          v-for="item in schemeList" />
                      </el-select>
                      <el-button size="mini" type="primary" @click="deleteSchemeFun"
                        style="margin-left: 10px;">删除方案</el-button>
                    </div>


                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="公式">
                    <el-checkbox-group v-model="dataForm.type" style="line-height: 33px;height: 33px">
                      <el-checkbox label="考虑安全库存" name="type"></el-checkbox>
                      <el-checkbox label="考虑可用库存" name="type"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="计算BOM级别">
                    <el-select v-model="dataForm.calcBomLevel" placeholder="计算BOM级别">
                      <el-option :key="item.id" :label="item.label" :value="item.value" v-for="item in BOMList" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="方案名称">
                    <div>
                      <el-input v-model="dataForm.schemeName" placeholder="方案名称" style="width: auto;" clearable />
                      <el-button type="primary" size="mini" @click="addSchemeFun()" style="margin-left: 10px;">
                        保存方案</el-button>

                    </div>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="已选择的计划" name="productInfo" class="productInfo">
            <div>
              <el-button type="text" style="margin-right:8px;margin-left: 4px; font-size:14px!important"
                icon="el-icon-plus" @click="openSeleceProductDialog()">添加计划</el-button>|
              <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                icon="el-icon-delete" @click="batchDelete">删除计划</el-button>
            </div>

            <JNPF-table ref="dataTable" :data="tableData" :fixedNO="true" @selection-change="handleSelectionChange" hasC
              style="height: auto;" class="planBox" v-if="isProjectSwitchFlag">
              <el-table-column prop="planNo" label="计划单号" min-width="180">
                <template slot-scope="scope">
                  <el-link type="primary" @click.native="handleUserRelation(scope.row, 'look')">{{
                    scope.row.planNo
                  }}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="productCode" label="产品编码" min-width="180" />
              <el-table-column prop="productName" label="产品名称" width="160" v-if="isProductNameSwitch === '1'"
                show-overflow-tooltip></el-table-column>
              <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
              <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" />
              <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
              <el-table-column prop="pairingModeName" label="配对方式" width="160" />

              <el-table-column prop="productSource" label="产品来源" min-width="160">
                <template slot-scope="scope">
                  <div v-if="scope.row.productSource == 'purchase'">采购</div>
                  <div v-if="scope.row.productSource == 'out'">外协</div>
                  <div v-if="scope.row.productSource == 'produce'">生产</div>
                  <div v-if="scope.row.productSource == 'assemble'">配件</div>
                </template>
              </el-table-column>
              <el-table-column prop="bomFlag" label="是否有BOM" min-width="160">
                <template slot-scope="scope">
                  <div v-if="scope.row.bomFlag">有BOM</div>
                  <div v-else>无BOM</div>
                </template>
              </el-table-column>
              <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" />
              <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" />
              <el-table-column prop="mainUnit" label="单位" min-width="80" />
              <el-table-column prop="planQuantity" label="计划数量" min-width="120" />
              <el-table-column prop="qualificationRate" label="合格率(%)" min-width="120" />
              <el-table-column prop="relaxQuantity" label="宽放计划数量" min-width="120" />
              <el-table-column prop="finalPlanQuantity" label="最终计划数量" min-width="120" />
              <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" v-if="sealingCoverTypingFlag == 1" />
              <el-table-column prop="accuracyLevel" label="精度等级" width="120" v-if="accuracyLevelFlag == 1" />
              <el-table-column prop="vibrationLevel" label="振动等级" width="120" v-if="vibrationLevelFlag == 1" />
              <el-table-column prop="oil" label="油脂" width="100" v-if="oilFlag == 1" />
              <el-table-column prop="oilQuantity" label="油脂量" width="120" v-if="oilQuantityFlag == 1" />
              <el-table-column prop="clearance" label="游隙" width="100" v-if="clearanceFlag == 1" />
              <el-table-column prop="packagingMethod" label="包装方式" width="120" v-if="packagingMethodFlag == 1" />
              <el-table-column prop="specialRequire" label="特殊要求" width="120" v-if="specialRequireFlag == 1" />
              <el-table-column prop="createTime" label="创建时间" min-width="180" />


              <el-table-column label="操作" width="120" fixed="right" :key="15">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleDel(scope)" style=" color: #ff3a3a">删除</el-button>
                </template>
              </el-table-column>
            </JNPF-table>
          </el-collapse-item>
        </el-collapse>

        <template v-if="activeStep == 1">
          <!--assemble组装 produce生产 purchase采购  out外协-->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组装需求" name="assemble">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
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
                <JNPF-table custom-column v-if="activeName == 'assemble'" @sort-change="sortChange1"
                  :partentOrChild="'assemble'" :data="assembleData" :setColumnDisplayList="columnList1"
                  highlight-current-row :fixedNO="true" class="dataTable" border ref="assembleRef">
                  <el-table-column prop="planNo" label="计划单号" min-width="140" sortable="custom" />
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="pairingModeName" label="配对方式" width="160"   />

                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM"
                        :
                        '无BOM'
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="immediatelyBuyFlag" label="立即组装" width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
                  <el-table-column prop="outputQuantity" label="需组装数量" min-width="140" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
                    v-if="sealingCoverTypingFlag == 1" />
                  <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
                    v-if="accuracyLevelFlag == 1" />
                  <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
                    v-if="vibrationLevelFlag == 1" />
                  <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
                  <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom"
                    v-if="oilQuantityFlag == 1" />
                  <el-table-column prop="clearance" label="游隙" width="100" sortable="custom"
                    v-if="clearanceFlag == 1" />
                  <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
                    v-if="packagingMethodFlag == 1" />
                  <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
                    v-if="specialRequireFlag == 1" />
                  <el-table-column label="操作" width="120" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" :disabled="!scope.row.bomFlag"
                        @click="QTsearch(scope.row.id, 'assemble',1)">齐套查询</el-button>
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
            </el-tab-pane>
            <el-tab-pane label="生产需求" name="produce">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
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
                <JNPF-table custom-column :partentOrChild="'produce'" @sort-change="sortChange2" :data="produceData"
                  v-if="activeName == 'produce'" :setColumnDisplayList="columnList2" :key="2" highlight-current-row
                  :fixedNO="true" class="dataTable" border ref="produceRef">
                  <el-table-column prop="planNo" label="计划单号" min-width="140" sortable="custom" />
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="pairingModeName" label="配对方式" width="160"  />

                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM"
                        :
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
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="occupancyQuantity" label="当前预占数量" min-width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="outputQuantity" label="需生产数量" min-width="140" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                  <el-table-column label="操作" width="180" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" @click="tracMainProduct(scope.row.id, 'produce')"
                        :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag">追溯主产品</el-button>
                      <el-button :disabled="!scope.row.bomFlag" type="text"
                        @click="QTsearch(scope.row.id, 'produce',1)">齐套查询</el-button>
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
            </el-tab-pane>
            <el-tab-pane label="采购需求" name="purchase">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
                  <div class="JNPF-common-head-right">
                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                        @click="columnSetFun('purchaseRef')" />
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                      <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                        @click="getpurchaseData()" />
                    </el-tooltip>
                  </div>
                </div>
                <JNPF-table custom-column :partentOrChild="'purchase'" @sort-change="sortChange3" :data="purchaseData"
                  :setColumnDisplayList="columnList3" highlight-current-row :fixedNO="true" class="dataTable" border
                  ref="purchaseRef">
                  <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" />
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="immediatelyBuyFlag" label="立即采购" width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                    </template>
                  </el-table-column>
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
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}
                      </div>
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
                  <el-table-column label="操作" width="120" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" @click="tracMainProduct(scope.row.id, 'purchase')"
                        :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag">追溯主产品</el-button>
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
              </div>
            </el-tab-pane>
            <el-tab-pane label="外协需求" name="out">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
                  <div class="JNPF-common-head-right">
                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                        @click="columnSetFun('outRef')" />
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                      <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                        @click="getouteData()" />
                    </el-tooltip>
                  </div>
                </div>
                <JNPF-table custom-column :partentOrChild="'out'" @sort-change="sortChange4" :data="outData"
                  highlight-current-row :setColumnDisplayList="columnList4" :fixedNO="true" class="dataTable" border
                  ref="outRef">

                  <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" /> 
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM"
                        :
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
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="occupancyQuantity" label="当前预占数量" min-width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outputQuantity" label="需外协数量" min-width="140" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                  <el-table-column label="操作" width="180" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" @click="tracMainProduct(scope.row.id, 'out')"
                        :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag">追溯主产品</el-button>
                      <el-button :disabled="!scope.row.bomFlag" type="text"
                        @click="QTsearch(scope.row.id, 'out',1)">齐套查询</el-button>
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
            </el-tab-pane>
          </el-tabs>
        </template>
        <template v-if="activeStep == 2">
          <!--assemble组装 produce生产 purchase采购  out外协-->
          <el-tabs v-model="activeNameIss" @tab-click="handleClickIssFun">
            <el-tab-pane label="组装需求" name="assemble">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
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
                <JNPF-table custom-column v-if="activeNameIss == 'assemble'" @sort-change="sortChange5"
                  :partentOrChild="'assemble'" :data="assembleDataIss" :setColumnDisplayList="columnList1"
                  highlight-current-row :fixedNO="true" class="dataTable" border ref="assembleRef">
                  <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" /> 
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="pairingModeName" label="配对方式" width="160"   />

                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM"
                        :
                        '无BOM'
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="immediatelyBuyFlag" label="立即组装" width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="mainUnit" label="单位" width="80" sortable="custom" />
                  <el-table-column prop="outputQuantity" label="需组装数量" min-width="140" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                  <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
                    v-if="sealingCoverTypingFlag == 1" />
                  <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
                    v-if="accuracyLevelFlag == 1" />
                  <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
                    v-if="vibrationLevelFlag == 1" />
                  <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
                  <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom"
                    v-if="oilQuantityFlag == 1" />
                  <el-table-column prop="clearance" label="游隙" width="100" sortable="custom"
                    v-if="clearanceFlag == 1" />
                  <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
                    v-if="packagingMethodFlag == 1" />
                  <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
                    v-if="specialRequireFlag == 1" />
                  <el-table-column label="操作" width="120" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" :disabled="!scope.row.bomFlag"
                        @click="QTsearch(scope.row.id, 'assemble',0)">齐套查询</el-button>
                    </template>
                  </el-table-column>

                </JNPF-table>
                <pagination :total="total1Iss" :page.sync="assembleFormIss.pageNum"
                  :limit.sync="assembleFormIss.pageSize" @pagination="getassembleDataIss">
                  <div style="background: #f5f7fa;text-align:end" class="text">
                    <!-- <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span> -->
                    <span style="font-weight:500;margin-right:10px">需组装数量：{{ outputQuantityIss }}</span>
                  </div>
                </pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="生产需求" name="produce">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
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
                <JNPF-table custom-column :partentOrChild="'produce'" @sort-change="sortChange6" :data="produceDataIss"
                  v-if="activeNameIss == 'produce'" :setColumnDisplayList="columnList2" :key="2" highlight-current-row
                  :fixedNO="true" class="dataTable" border ref="produceRef"> 
                  <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" />
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="pairingModeName" label="配对方式" width="160"   />

                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM"
                        :
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
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="occupancyQuantity" label="当前预占数量" min-width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                    </template>
                  </el-table-column>

                  <el-table-column prop="outputQuantity" label="需生产数量" min-width="140" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                  <el-table-column label="操作" width="180" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" @click="tracMainProduct(scope.row.id, 'produce')"
                        :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag">追溯主产品</el-button>
                      <el-button :disabled="!scope.row.bomFlag" type="text"
                        @click="QTsearch(scope.row.id, 'produce',0)">齐套查询</el-button>
                    </template>
                  </el-table-column>

                </JNPF-table>
                <pagination :total="total2Iss" :page.sync="produceFormIss.pageNum" :limit.sync="produceFormIss.pageSize"
                  @pagination="getproduceDataIss">
                  <div style="background: #f5f7fa;text-align:end" class="text">
                    <!-- <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">损耗数量：{{ lossNum }}</span>
                    <span style="font-weight:500;margin-right:10px">计划在制数量：{{ planInTransitQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">实际在制数量：{{ inTransitUnOccupancyQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">当前预占数量：{{ occupancyQuantity }}</span> -->
                    <span style="font-weight:500;margin-right:10px">需生产数量：{{ outputQuantityIss }}</span>
                  </div>
                </pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="采购需求" name="purchase">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
                  <div class="JNPF-common-head-right">
                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                        @click="columnSetFun('purchaseRef')" />
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                      <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                        @click="getpurchaseData()" />
                    </el-tooltip>
                  </div>
                </div>
                <JNPF-table v-if="activeNameIss == 'purchase'" custom-column :partentOrChild="'purchase'"
                  @sort-change="sortChange7" :data="purchaseDataIss" :setColumnDisplayList="columnList3"
                  highlight-current-row :fixedNO="true" class="dataTable" border ref="purchaseRef">
                  <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" /> 
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="immediatelyBuyFlag" label="立即采购" width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.immediatelyBuyFlag ? "是" : "否" }}</div>
                    </template>
                  </el-table-column>
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
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}
                      </div>
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
                  <el-table-column label="操作" width="120" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" @click="tracMainProduct(scope.row.id, 'purchase')"
                        :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag">追溯主产品</el-button>
                    </template>
                  </el-table-column>

                </JNPF-table>
                <pagination :total="total3Iss" :page.sync="purchaseFormIss.pageNum"
                  :limit.sync="purchaseFormIss.pageSize" @pagination="getpurchaseDataIss">
                  <div style="background: #f5f7fa;text-align:end" class="text">
                    <!-- <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">损耗数量：{{ lossNum }}</span>
                    <span style="font-weight:500;margin-right:10px">计划在途数量：{{ planInTransitQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">实际在途数量：{{ inTransitUnOccupancyQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">当前预占数量：{{ occupancyQuantity }}</span> -->
                    <span style="font-weight:500;margin-right:10px">需采购数量：{{ outputQuantityIss }}</span>
                  </div>
                </pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane label="外协需求" name="out">
              <div class=" " style="height: 100%;">
                <div class="JNPF-common-head">
                  <div></div>
                  <div class="JNPF-common-head-right">
                    <el-tooltip effect="dark" :content="$t('common.columnSettings')" placement="top">
                      <el-link icon="icon-ym icon-ym-shezhi JNPF-common-head-icon" :underline="false"
                        @click="columnSetFun('outRef')" />
                    </el-tooltip>
                    <el-tooltip effect="dark" :content="$t('common.refresh')" placement="top">
                      <el-link icon="icon-ym icon-ym-Refresh JNPF-common-head-icon" :underline="false"
                        @click="getouteData()" />
                    </el-tooltip>
                  </div>
                </div>
                <JNPF-table v-if="activeNameIss == 'out'" custom-column :partentOrChild="'out'"
                  @sort-change="sortChange8" :data="outDataIss" highlight-current-row :setColumnDisplayList="columnList4"
                  :fixedNO="true" class="dataTable" border ref="outRef">

                  <el-table-column prop="planNo" label="计划单号" width="170" sortable="custom" /> 
                  <el-table-column prop="productCode" label="产品编码" min-width="140" sortable="custom" />
                  <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                    v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productCategoryName" label="产品分类" width="140" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch == 1" />
                  <el-table-column prop="bomFlag" label="是否有BOM" min-width="140" sortable="custom">
                    <template slot-scope="scope">
                      <div :style="scope.row.bomFlag ? 'color:#85ce60' : 'color:#f56c6c'">{{ scope.row.bomFlag ? "有BOM"
                        :
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
                      <div>{{ scope.row.inTransitUnOccupancyQuantity ? scope.row.inTransitUnOccupancyQuantity : 0 }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="occupancyQuantity" label="当前预占数量" min-width="160" sortable="custom">
                    <template slot-scope="scope">
                      <div>{{ scope.row.occupancyQuantity ? scope.row.occupancyQuantity : 0 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="outputQuantity" label="需外协数量" min-width="140" sortable="custom" />
                  <el-table-column prop="planStartDate" label="计划开始日期" width="180" sortable="custom" />
                  <el-table-column prop="planEndDate" label="计划结束日期" width="180" sortable="custom" />
                  <el-table-column label="操作" width="180" fixed="right" :key="15">
                    <template slot-scope="scope">
                      <el-button type="text" @click="tracMainProduct(scope.row.id, 'out')"
                        :disabled="scope.row.outputQuantity == 0 || scope.row.mainProductFlag">追溯主产品</el-button>
                      <el-button :disabled="!scope.row.bomFlag" type="text"
                        @click="QTsearch(scope.row.id, 'out',0)">齐套查询</el-button>
                    </template>
                  </el-table-column>

                </JNPF-table>
                <pagination :total="total4Iss" :page.sync="outFormIss.pageNum" :limit.sync="outFormIss.pageSize"
                  @pagination="getouteDataIss">
                  <div style="background: #f5f7fa;text-align:end" class="text">
                    <!-- <span style="font-weight:500;margin-right:10px">需求数量：{{ totalDemandQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">损耗数量：{{ lossNum }}</span>
                    <span style="font-weight:500;margin-right:10px">计划在制数量：{{ planInTransitQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">实际在制数量：{{ inTransitUnOccupancyQuantity }}</span>
                    <span style="font-weight:500;margin-right:10px">当前预占数量：{{ occupancyQuantity }}</span> -->
                    <span style="font-weight:500;margin-right:10px">需外协数量：{{ outputQuantityIss }}</span>
                  </div>
                </pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
      <!-- <TableForm :visible.sync="formVisible" ref="tableForm" @closeForm="closeForm"
        :dbLinkId="dataForm.dbLinkId" /> -->
      <el-dialog title="选择计划" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="planVisible"
        lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro" width="70%" append-to-body>

        <div class="JNPF-common-layout" style="height: 68vh;overflow: auto;">

          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box treeBox_bot" :gutter="16">
              <el-form @submit.native.prevent>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchPlan()"  v-model="planForm.planNo" placeholder="请输入计划单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-input @keyup.native.enter="searchPlan()"  v-model="planForm.productDrawingNo" placeholder="请输入品名规格" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="deliveryDateArr" type="daterange" value-format="yyyy-MM-dd"
                      style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchPlan()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetPlan()">{{
                      $t('common.reset')
                    }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <JNPF-table :data="planTableData" hasC @sort-change="sortChange" @selection-change="selectPlanFun"
                ref="dataTableRef" @row-click="handleRowClick">
                <el-table-column prop="planNo" label="计划单号" min-width="180" sortable="custom"> </el-table-column>
                <el-table-column prop="productCode" label="产品编码" min-width="120" sortable="custom" />
                <el-table-column prop="productName" label="产品名称" sortable="custom" width="160"
                  v-if="isProductNameSwitch === '1'" show-overflow-tooltip></el-table-column>
                <el-table-column prop="productDrawingNo" label="品名规格" min-width="330" sortable="custom" />
                <el-table-column prop="projectName" label="所属项目" min-width="120" sortable="custom"
                  v-if="isProjectSwitch == 1" />
                <el-table-column prop="productSource" label="产品来源" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.productSource == 'purchase'">采购</div>
                    <div v-if="scope.row.productSource == 'out'">外协</div>
                    <div v-if="scope.row.productSource == 'produce'">生产</div>
                    <div v-if="scope.row.productSource == 'assemble'">配件</div>
                  </template>
                </el-table-column>
                <el-table-column prop="bomFlag" label="是否有BOM" min-width="160" sortable="custom">
                  <template slot-scope="scope">
                    <div v-if="scope.row.bomFlag">有BOM</div>
                    <div v-else>无BOM</div>
                  </template>
                </el-table-column>
                <el-table-column prop="planStartDate" label="计划开始日期" min-width="160" sortable="custom" />
                <el-table-column prop="planEndDate" label="计划结束日期" min-width="160" sortable="custom" />
                <el-table-column prop="mainUnit" label="单位" min-width="80" />
                <el-table-column prop="finalPlanQuantity" label="最终计划数量" min-width="120" sortable="custom" />
                <el-table-column prop="sealingCoverTyping" label="打字内容" width="120" sortable="custom"
                  v-if="sealingCoverTypingFlag == 1" />
                <el-table-column prop="accuracyLevel" label="精度等级" width="120" sortable="custom"
                  v-if="accuracyLevelFlag == 1" />
                <el-table-column prop="vibrationLevel" label="振动等级" width="120" sortable="custom"
                  v-if="vibrationLevelFlag == 1" />
                <el-table-column prop="oil" label="油脂" width="100" sortable="custom" v-if="oilFlag == 1" />
                <el-table-column prop="oilQuantity" label="油脂量" width="120" sortable="custom"
                  v-if="oilQuantityFlag == 1" />
                <el-table-column prop="clearance" label="游隙" width="100" sortable="custom" v-if="clearanceFlag == 1" />
                <el-table-column prop="packagingMethod" label="包装方式" width="120" sortable="custom"
                  v-if="packagingMethodFlag == 1" />
                <el-table-column prop="specialRequire" label="特殊要求" width="120" sortable="custom"
                  v-if="specialRequireFlag == 1" />
                <el-table-column prop="createTime" label="创建时间" min-width="180" sortable="custom" />
              </JNPF-table>
              <pagination :total="total" :page.sync="planForm.pageNum" :limit.sync="planForm.pageSize"
                @pagination="searchPlan" />
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="planVisible = false">{{ $t('common.cancelButton') }}</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitAllProduct()">
            确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="选择交货日期" :close-on-click-modal="false" :close-on-press-escape="false"
        :visible.sync="selectDateDialogVisible" lock-scroll class="JNPF-dialog JNPF-dialog_center selectPro"
        width="400px" append-to-body>


        <el-row class="JNPF-common-search-box treeBox_bot issForm" :gutter="16">
          <el-form @submit.native.prevent ref="issForm" :model="issForm" :rules="dataRule" label-width="120px"
            label-position="left">

            <el-col :span="24" v-if='purchaseDataIss.length'>
              <el-form-item prop='purchaseDeliveryDate' label="采购交货日期">
                <el-date-picker v-model="issForm.purchaseDeliveryDate" type="date" value-format="yyyy-MM-dd"
                  style="width: 100%;margin-left:0;" placeholder="请选择交货日期" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if='outDataIss.length'>
              <el-form-item prop="outDeliveryDate" label="外协交货日期">
                <el-date-picker v-model="issForm.outDeliveryDate" type="date" value-format="yyyy-MM-dd"
                  style="width: 100%;margin-left:0;" placeholder="请选择交货日期" clearable>
                </el-date-picker>
              </el-form-item>
            </el-col>

          </el-form>
        </el-row>


        <span slot="footer" class="dialog-footer">
          <el-button @click="selectDateDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="submitIssFun()">
            确定</el-button>
        </span>
      </el-dialog>
      <PlanForm v-if="formVisible" ref="orderForm" @close="closeForm" />
      <ComplateSetForm v-if="complateSetFormVisible" ref="complateSetForm" @close="closeForm"
        :customList="customList" />
      <DBForm v-if="dbformVisible" ref="dbForm" @close="closeForm" />


    </div>
  </transition>
</template>

<script>
import { getMrpCalcSchemeList, addMrpCalcSchemeList, delMrpCalcSchemeList } from '@/api/plan/index.js'
import { addPlanList, updatePlanList, deletePlanList, getPlanList, detailPlanList } from '@/api/calculationList/calculationList.js'
import PlanForm from '@/views/planManagement/assemblyPlan/salesOrderCreation/Form.vue'
import { analyseMRP, getMaterialDemandReport, submitMRP, issueApi } from "@/api/calculationList/MRPOperation.js"
import ComplateSetForm from './complateSetForm.vue'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
import DBForm from './dbForm.vue'

import {
  getbimProductAttributesList, getbimProductAttributes, getbimProductAttributesListMap
} from "@/api/masterDataManagement/index";
import { getBimBusinessDetail, getOrderFiledMap } from '@/api/basicData/index'
export default {
  components: {
    PlanForm, ComplateSetForm, DBForm
  },
  mixins: [getProjectList],
  data() {
    return {
      columnList1: ["productCode",  "sealingCoverTyping", "accuracyLevel", "vibrationLevel", "oil", "oilQuantity", "clearance", "packagingMethod", "specialRequire", "planEndDate"],
      columnList2: ["productCode",  "planEndDate"],
      columnList3: ["productCode",  "planEndDate"],
      columnList4: ["productCode",  "planEndDate"],
      // ---------运算结果相关字段
      complateSetFormVisible: false,
      dbformVisible: false,
      total1: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total1Iss: 0,
      total2Iss: 0,
      total3Iss: 0,
      total4Iss: 0,
      activeName: "assemble",
      activeNameIss: "assemble",
      assembleData: [],
      produceData: [],
      purchaseData: [],
      outData: [],
      assembleDataIss: [],
      produceDataIss: [],
      purchaseDataIss: [],
      outDataIss: [],
      assembleForm: {
        demandType: "assemble",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "draft",
      },
      produceForm: {
        demandType: "produce",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "draft",
      },
      purchaseForm: {
        demandType: "purchase",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "draft",
      },
      outForm: {
        demandType: "out",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "draft",
      },
      assembleFormIss: {
        planIdList: [],
        demandType: "assemble",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "submit",
      },
      produceFormIss: {
        planIdList: [],
        demandType: "produce",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "submit",
      },
      purchaseFormIss: {
        planIdList: [],
        demandType: "purchase",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "submit",
      },
      outFormIss: {
        planIdList: [],
        demandType: "out",
        demandState: "not_finish",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageSize: 20,
        pageNum: 1,
        documentStatus: "submit",
      },
      totalDemandQuantity: 0,//需求数量
      outputQuantity: 0,//需组装/生产/采购/外协数量
      lossNum: 0,//损耗数量
      planInTransitQuantity: 0,//计划在制在途数量
      inTransitUnOccupancyQuantity: 0,//实际在制在途数量
      occupancyQuantity: 0,//当前预占数量

      totalDemandQuantityIss: 0,//需求数量
      outputQuantityIss: 0,//需组装/生产/采购/外协数量
      lossNumIss: 0,//损耗数量
      planInTransitQuantityIss: 0,//计划在制在途数量
      inTransitUnOccupancyQuantityIss: 0,//实际在制在途数量
      occupancyQuantityIss: 0,//当前预占数量




      codeConfig: {},
      planForm: {
        planNo: "",
        documentStatus: "submit",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        pageNum: 1,
        pageSize: 20,
        planState: "not_finished",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      },
      total: 0,
      planTableData: [],
      deliveryDateArr: [],
      planVisible: false,
      dataForm: {
        type: ["考虑可用库存", "考虑安全库存"],
        calcBomLevel: "calc_first_bom",
        schemeName: "上一次运算方案",
        schemeNames: "",
        calcSchemeId: "",
        arithmeticNo: "",
        projectId: "",
      },
      formVisible: false,
      btnLoading: false,
      schemeList: [],
      tableData: [],
      selectRows: [],
      BOMList: [
        { label: "不计算BOM", value: "not_calc_bom", },
        { label: "只计算1级BOM", value: "calc_first_bom", },
        { label: "计算所有子级BOM", value: "calc_all_bom", },
      ],
      activeNames: ["productInfo", "basicInfo"],
      visible: false,
      loading: false,
      activeStep: 0,
      maxStep: 1,
      dataRule: {
        outDeliveryDate: [
          { required: true, message: '外协交货日期不能为空', trigger: 'change' },
        ],
        purchaseDeliveryDate: [
          { required: true, message: '采购交货日期不能为空', trigger: 'change' },
        ],
      },
      issForm: {
        outDeliveryDate: "",
        purchaseDeliveryDate: "",
        planIdList: [],
      },
      selectArr: [],
      isProjectSwitch: '',
      isProjectSwitchFlag: false,
      originalData: [],
      projectIdDataList: [],
      planIdList: [],
      selectDateDialogVisible: false,
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
      bimProductAttributesList: [],
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  async created() {
    await this.getProductClassFun()
    await this.getProductAttributeFun()
    await this.getProjectSwitch('system', 'project')
    await this.getProjectList()
    await this.getProductNameSwitch('product', 'enable_productName')

    console.log("下拉项", this.projectIdDataList);
    this.getMrpCalcSchemeListFun()
    if (this.isProjectSwitch == 1) {
      console.log(1111);
      this.dataForm.projectId = this.userInfo.projectId == 1 ? "" : this.userInfo.projectId
    }

  },
  mounted() {
    this.fetchData("AMDH")
  },
  methods: {
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {
      // 产品属性
      getbimProductAttributesListMap().then((res) => {
        this.bimProductAttributesList = res.data
      })

    },

    // 获取业务参数中 属性字段动态显示
    getProductAttributeFun() {
      getOrderFiledMap('sale').then(res => {
        console.log("产品属性", res, this.bimProductAttributesList);
        // sealingCoverTypingFlag list1  pa007
        // accuracyLevelFlag list2  pa006
        // vibrationLevelFlag list3 pa005
        // oilFlag list4 pa002
        // oilQuantityFlag list5 pa003
        // clearanceFlag list6 pa001
        // packagingMethodFlag list7 pa015
        // specialRequireFlag list8 pa016

        this.accuracyLevelFlag = res.data.accuracyLevel //list1

        this.clearanceFlag = res.data.clearance

        console.log("this.list6", this.list6);
        this.oilFlag = res.data.oil

        this.oilQuantityFlag = res.data.oilQuantity

        this.packagingMethodFlag = res.data.packagingMethod

        this.sealingCoverTypingFlag = res.data.sealingCoverTyping

        this.specialRequireFlag = res.data.specialRequire

        this.vibrationLevelFlag = res.data.vibrationLevel

        console.log(this.list3);



      })
    },
    async getProductNameSwitch(code, type) {
      try {
        this.isProductNameSwitch = await this.jnpf.getMainUnitFun(code, type)
        this.isProjectSwitchFlag = true
      } catch (error) { }
    },
    // 全部下达
    allIssueFun() {
      if (this.outDataIss.length || this.purchaseDataIss.length) return this.selectDateDialogVisible = true
      this.issForm.planIdList = this.planIdList
      issueApi(this.issForm).then(res => {
        this.selectDateDialogVisible = false
        this.btnLoading = false
        this.$message.success("全部下达成功")
        this.closeDialog()
      }).catch(error => {
        this.btnLoading = false
      })
    },
    // 提交下达
    submitIssFun() {
      this.$refs['issForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.issForm.planIdList = this.planIdList
          issueApi(this.issForm).then(res => {
            this.selectDateDialogVisible = false
            this.btnLoading = false
            this.$message.success("全部下达成功")
            this.closeDialog()
          }).catch(error => {
            this.btnLoading = false
          })
        }
      })
    },


    changeProject() {
      console.log(this.dataForm.projectId);
    },
    // ----------------------------------------运算结果相关逻辑处理开始
    handleClickIssFun() {
      if (this.activeNameIss == "assemble") {
        this.getassembleDataIss()
      }
      if (this.activeNameIss == "produce") {
        this.getproduceDataIss()

      }
      if (this.activeNameIss == "purchase") {
        this.getpurchaseDataaIss()

      }
      if (this.activeNameIss == "out") {
        this.getouteDataIss()

      }
    },
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
        this.getpurchaseData()

      }
      if (this.activeName == "out") {
        this.getouteData()

      }
    },
    columnSetFun(ref) {
      this.$refs[ref].showDrawer()

    },

    // 齐套查询
    QTsearch(id, type,flag) {
      this.complateSetFormVisible = true
      this.$nextTick(() => {
        this.$refs.complateSetForm.init(id, type,flag);
      });
    },
    sortChange1({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.assembleForm.orderItems[0].asc = order === "ascending"
      this.assembleForm.orderItems[0].column = order === null ? "" : newProp
      this.getassembleData()
    },
    // 组装列表数据
    getassembleData() {
      this.assembleForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

      getMaterialDemandReport(this.assembleForm).then(res => {
        console.log("组装res", res);
        let totalData = res.data.total || 0
        let tableData = res.data.page.records || []
        this.total1 = res.data.page.total || 0
        this.assembleData = tableData || []

        this.totalDemandQuantity = totalData.demandQuantity || 0
        this.outputQuantity = totalData.outputQuantity || 0

      })
    },
    sortChange5({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.assembleFormIss.orderItems[0].asc = order === "ascending"
      this.assembleFormIss.orderItems[0].column = order === null ? "" : newProp
      this.getassembleDataIss()
    },
    // 组装数据  全部下达界面
    getassembleDataIss() {
      this.assembleFormIss.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.assembleFormIss.planIdList = this.planIdList
      getMaterialDemandReport(this.assembleFormIss).then(res => {
        console.log("组装res", res);
        let totalData = res.data.total || 0
        let tableData = res.data.page.records || []
        this.total1Iss = res.data.page.total || 0
        this.assembleDataIss = tableData || []
        this.totalDemandQuantityIss = totalData.demandQuantity || 0
        this.outputQuantityIss = totalData.outputQuantity || 0

      })
    },
    sortChange2({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.produceForm.orderItems[0].asc = order === "ascending"
      this.produceForm.orderItems[0].column = order === null ? "" : newProp
      this.getproduceData()
    },
    // 生产列表数据
    getproduceData() {
      this.produceForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getMaterialDemandReport(this.produceForm).then(res => {
        console.log("生产res", res);
        let totalData = res.data.total || 0
        let tableData = res.data.page.records || []
        if (tableData.length) {
          tableData.forEach(item => {

            item.occupancyQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [item.occupancyQuantity, item.inTransitOccupancyQuantity, item.processOccupancyQuantity]), 6)
          });

        }
        this.produceData = tableData || []
        this.total2 = res.data.page.total || 0

        this.totalDemandQuantity = totalData.demandQuantity || 0
        this.outputQuantity = totalData.outputQuantity || 0
        this.lossNum = totalData.lossNum || 0
        this.planInTransitQuantity = totalData.planInTransitQuantity || 0
        this.inTransitUnOccupancyQuantity = totalData.inTransitUnOccupancyQuantity || 0
        this.occupancyQuantity = totalData.occupancyQuantity || 0

      })
    },
    sortChange6({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.produceFormIss.orderItems[0].asc = order === "ascending"
      this.produceFormIss.orderItems[0].column = order === null ? "" : newProp
      this.getproduceDataIss()
    },
    // 生产数据  全部下达界面
    getproduceDataIss() {
      this.produceFormIss.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

      this.produceFormIss.planIdList = this.planIdList
      getMaterialDemandReport(this.produceFormIss).then(res => {
        console.log("组装res", res);
        let totalData = res.data.total || 0
        let tableData = res.data.page.records || []
        this.total1Iss = res.data.page.total || 0
        if (tableData.length) {
          tableData.forEach(item => {

            item.occupancyQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [item.occupancyQuantity, item.inTransitOccupancyQuantity, item.processOccupancyQuantity]), 6)
          });

        }
        this.produceDataIss = tableData || []
        this.totalDemandQuantityIss = totalData.demandQuantity || 0
        this.outputQuantityIss = totalData.outputQuantity || 0

      })
    },
    sortChange3({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.purchaseForm.orderItems[0].asc = order === "ascending"
      this.purchaseForm.orderItems[0].column = order === null ? "" : newProp
      this.getpurchaseData()
    },
    // 采购列表数据
    getpurchaseData() {
      this.purchaseForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getMaterialDemandReport(this.purchaseForm).then(res => {
        console.log("采购res", res);
        let totalData = res.data.total || 0
        let tableData = res.data.page.records || []
        if (tableData.length) {
          tableData.forEach(item => {

            item.occupancyQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [item.occupancyQuantity, item.inTransitOccupancyQuantity, item.processOccupancyQuantity]), 6)
          });

        }
        this.purchaseData = tableData || 0
        this.total3 = res.data.page.total || 0

        this.totalDemandQuantity = totalData.demandQuantity || 0
        this.outputQuantity = totalData.outputQuantity || 0
        this.lossNum = totalData.lossNum || 0
        this.planInTransitQuantity = totalData.planInTransitQuantity || 0
        this.inTransitUnOccupancyQuantity = totalData.inTransitUnOccupancyQuantity || 0
        this.occupancyQuantity = totalData.occupancyQuantity || 0


      })
    },
    sortChange7({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.purchaseFormIss.orderItems[0].asc = order === "ascending"
      this.purchaseFormIss.orderItems[0].column = order === null ? "" : newProp
      this.getpurchaseDataaIss()
    },
    // 采购 数据 全部下达界面
    getpurchaseDataaIss() {
      this.purchaseFormIss.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.purchaseFormIss.planIdList = this.planIdList
      getMaterialDemandReport(this.purchaseFormIss).then(res => {
        console.log("采购res", res);
        let totalData = res.data.total || 0
        let tableData = res.data.page.records || []
        if (tableData.length) {
          tableData.forEach(item => {

            item.occupancyQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [item.occupancyQuantity, item.inTransitOccupancyQuantity, item.processOccupancyQuantity]), 6)
          });

        }
        this.purchaseDataIss = tableData || 0
        this.total3Iss = res.data.page.total || 0

        this.totalDemandQuantityIss = totalData.demandQuantity || 0
        this.outputQuantityIss = totalData.outputQuantity || 0
        this.lossNumIss = totalData.lossNum || 0
        this.planInTransitQuantityIss = totalData.planInTransitQuantity || 0
        this.inTransitUnOccupancyQuantityIss = totalData.inTransitUnOccupancyQuantity || 0
        this.occupancyQuantityIss = totalData.occupancyQuantity || 0


      })
    },
    sortChange4({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.outForm.orderItems[0].asc = order === "ascending"
      this.outForm.orderItems[0].column = order === null ? "" : newProp
      this.getouteData()
    },
    // 外协列表数据
    getouteData() {
      this.outForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getMaterialDemandReport(this.outForm).then(res => {
        console.log("外协res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          tableData.forEach(item => {

            item.occupancyQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [item.occupancyQuantity, item.inTransitOccupancyQuantity, item.processOccupancyQuantity]), 6)
          });

        }
        this.outData = tableData || []
        this.total4 = res.data.page.total || 0

        this.totalDemandQuantity = totalData.demandQuantity || 0
        this.outputQuantity = totalData.outputQuantity || 0
        this.lossNum = totalData.lossNum || 0
        this.planInTransitQuantity = totalData.planInTransitQuantity || 0
        this.inTransitUnOccupancyQuantity = totalData.inTransitUnOccupancyQuantity || 0
        this.occupancyQuantity = totalData.occupancyQuantity || 0


      })
    },
    sortChange8({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.outFormIss.orderItems[0].asc = order === "ascending"
      this.outFormIss.orderItems[0].column = order === null ? "" : newProp
      this.getouteDataIss()
    },
    // 外协数据  全部下达界面
    getouteDataIss() {
      this.outFormIss.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      this.outFormIss.planIdList = this.planIdList
      getMaterialDemandReport(this.outFormIss).then(res => {
        console.log("外协res", res);
        let totalData = res.data.total
        let tableData = res.data.page.records
        if (tableData.length) {
          tableData.forEach(item => {

            item.occupancyQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [item.occupancyQuantity, item.inTransitOccupancyQuantity, item.processOccupancyQuantity]), 6)
          });

        }
        this.outDataIss = tableData || []
        this.total4Iss = res.data.page.total || 0

        this.totalDemandQuantityIss = totalData.demandQuantity || 0
        this.outputQuantityIss = totalData.outputQuantity || 0
        this.lossNumIss = totalData.lossNum || 0
        this.planInTransitQuantityIss = totalData.planInTransitQuantity || 0
        this.inTransitUnOccupancyQuantityIss = totalData.inTransitUnOccupancyQuantity || 0
        this.occupancyQuantityIss = totalData.occupancyQuantity || 0


      })
    },
    // 追溯主产品
    tracMainProduct(id, type) {
      this.dbformVisible = true
      this.$nextTick(() => {
        this.$refs.dbForm.init(id, type)
      })
    },
    // 提交计算结果
    dataFormSubmit() {
      this.btnLoading = true
      submitMRP({
        projectId: this.planForm.projectId = this.userInfo.projectId == 1 ? "" : this.userInfo.projectId
      }).then(res => {
        this.$message.success("提交成功")
        this.btnLoading = false
        this.activeStep = 2
        //   setTimeout(() => {
        //   this.closeDialog()
        // }, 1500);
        this.handleClickIssFun()
      }).catch(error => {
        this.btnLoading = false
      })
    },

    // ----------------------------------------运算结果相关逻辑处理结束








    // 获取运算单号
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        this.dataForm.arithmeticNo = data.number

      } catch (error) {
      }
    },

    // 已选计划表格多选
    handleSelectionChange(val) {
      this.selectRows = val
    },
    selectPlanFun(val) {
      this.selectArr = val
    },
    submitAllProduct() {
      if (!this.selectArr.length) return this.$message.error("请选择计划")
      this.selectArr.forEach(item => {
        this.tableData.push(item)
      });
      let uniqueArr = [];
      let idSet = new Set();

      this.tableData.forEach(item => {
        if (!idSet.has(item.id)) {
          uniqueArr.push(item);
          idSet.add(item.id);
        }
      });
      this.tableData = uniqueArr
      this.planVisible = false
    },
    //多选
    handleRowClick(row) {
      this.$refs['dataTableRef'].$refs.JNPFTable.toggleRowSelection(row)
    },
    openSeleceProductDialog() {
      this.planVisible = true
      this.searchPlan()
    },
  
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'productName' || prop === 'productCode' || prop === 'documentStatus') {
        newProp = prop
      } else if (prop === 'createTime') {
        newProp = 't1.create_time'

      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.searchPlan()
    },
    searchPlan() {

      if (this.deliveryDateArr && this.deliveryDateArr.length > 0) {
        this.planForm.planSsd = this.deliveryDateArr[0]
        this.planForm.planSed = this.deliveryDateArr[1]
      } else {
        this.planForm.planSsd = ""
        this.planForm.planSed = ""
      }
      this.planForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

      getPlanList(this.planForm).then(res => {
        this.planTableData = res.data.records
        this.total = res.data.total
      })
    },
    resetPlan() {
      this.$refs['dataTableRef'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.deliveryDateArr = []
      this.planForm = {
        planNo: "",
        documentStatus: "submit",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        pageNum: 1,
        pageSize: 20,
        planState: "not_finished",
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      }
    },
    // 关闭新建编辑页面
    closeForm() {
      this.formVisible = false
      this.complateSetFormVisible = false
      this.dbformVisible = false
    },
    // 获取运算方案
    getMrpCalcSchemeListFun() {
      let obj = {

        schemeName: "",
        pageNum: 1,
        pageSize: 10,
        orderItems: [{
          asc: false,
          column: "create_time"
        }],

        superQuery: {},
      }
      obj.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getMrpCalcSchemeList(obj).then(res => {
        console.log("方案数据", res);
        let arr = []
        if (res.data.records.length) {
          res.data.records.forEach(item => {
            let obj = {
              availableStockFlag: item.availableStockFlag,
              safeInventoryFlag: item.safeInventoryFlag,
              calcBomLevel: item.calcBomLevel,
              schemeName: item.schemeName,
              id: item.id
            }
            arr.push(obj)

          });
          this.schemeList = arr
          this.dataForm.schemeNames = this.schemeList[0].schemeName
          this.dataForm.schemeId = this.schemeList[0].id
          this.dataForm.calcBomLevel = this.schemeList[0].calcBomLevel
          this.dataForm.type = []
          if (this.schemeList[0].safeInventoryFlag) {
            this.dataForm.type.push('考虑安全库存')
          }
          if (this.schemeList[0].availableStockFlag) {
            this.dataForm.type.push('考虑可用库存')
          }
          this.dataForm.schemeName = '上一次运算方案'
        }else{
          this.schemeList=[]
          this.dataForm.schemeNames=''
        }
      })
    },
    // 选择方案
    selectsChemeFun(e) {
      console.log(e);
      const result = this.schemeList.find(item => item.id === e);
      console.log(result);
      this.dataForm.schemeNames = result.schemeName
      this.dataForm.schemeId = result.id
      this.dataForm.calcBomLevel = result.calcBomLevel
      this.dataForm.type = []
      if (result.safeInventoryFlag) {
        this.dataForm.type.push('考虑安全库存')
      }
      if (result.availableStockFlag) {
        this.dataForm.type.push('考虑可用库存')
      }
    },
    // 删除方案
    deleteSchemeFun() {
      if (!this.schemeList.length) return this.$message.error("暂无方案可删除")
      console.log(this.dataForm);
      delMrpCalcSchemeList(this.dataForm.schemeId).then(res => {
        this.$message.success("删除方案成功")
        this.getMrpCalcSchemeListFun()
      })
    },

    // 保存方案
    addSchemeFun() {
      let obj = {
        rangeList: [],
        scheme: {
          schemeName: this.dataForm.schemeName,
          calcBomLevel: this.dataForm.calcBomLevel,
        }
      }
      if (this.dataForm.type.length) {
        this.dataForm.type.forEach(item => {
          if (item == '考虑可用库存') {
            obj.scheme.availableStockFlag = 1

          }
          if (item == '考虑安全库存') {
            obj.scheme.safeInventoryFlag = 1

          }
        });
      } else {
        obj.scheme.availableStockFlag = 0
        obj.scheme.safeInventoryFlag = 0
      }
      console.log(obj);
      if (!obj.scheme.schemeName) return this.$message.error("方案名称不能为空")
      obj.scheme.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      addMrpCalcSchemeList(obj).then(res => {
        this.$message.success("保存方案成功")
        this.getMrpCalcSchemeListFun()
      })
    },
    closeDialog() {
      this.$emit('close', true)
    },
    stepChick(val) {

    },
    handleUserRelation(data, btnType) {
      console.log(data, btnType);
      // 订单创建计划
      detailPlanList(data.id).then(res => {
        console.log("订单计划详情", res);
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.orderForm.init(data.id, btnType, res.data, data.planType)
        })
      })

    },
    // 批量删除
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
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      this.tableData.splice(data.$index, 1)
    },
    init(data) {
      console.log(data);
      setTimeout(() => {
        this.visible = true
        this.originalData = JSON.parse(JSON.stringify(data))
        this.tableData = data
      }, 500);

    },
    // 下一步
    next() {
      if(!this.dataForm.projectId) return this.$message.error("请选择所属项目")
      if (!this.dataForm.arithmeticNo) return this.$message.error("运算单号不能为空")
      if (!this.tableData.length) return this.$message.error("已选择的计划数据不能为空")
      let hasFalseBomFlag = this.tableData.some(item => !item.bomFlag )
      if(hasFalseBomFlag&&this.dataForm.calcBomLevel!=='not_calc_bom') return this.$message.error("存在无BOM的数据，BOM计算级别错误，请检查后重试")
   
     this.loading=true
     this.btnLoading=true
      let obj = {
        arithmetic: {
          arithmeticNo: this.dataForm.arithmeticNo,
          availableStockFlag: 0,
          availableStockFlag: 0,
          calcBomLevel: this.dataForm.calcBomLevel,
          documentStatus: "submit",
          projectId: this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''

        },
        planIdList: [],
        rangeList: [],
      }
      if (this.dataForm.type.length) {
        this.dataForm.type.forEach(item => {
          if (item == '考虑可用库存') {
            obj.arithmetic.availableStockFlag = 1

          }
          if (item == '考虑安全库存') {
            obj.arithmetic.safeInventoryFlag = 1

          }
        });
      } else {
        obj.arithmetic.availableStockFlag = 0
        obj.arithmetic.safeInventoryFlag = 0
      }
      this.tableData.forEach(item => {
        obj.planIdList.push(item.id)
      });
      this.planIdList = obj.planIdList
      analyseMRP(obj).then(res => {
        console.log("res", res);
        this.$message.success("分析成功")
        this.activeStep = 1
        this.activeName = 'assemble'
        this.loading=false
        this.btnLoading=false
        this.getassembleData()
      }).catch(error=>{
        this.btnLoading=false
        this.loading=false
      })
    },
    prev() {
      this.activeStep = 0

    }
  }
}
</script>
<style scoped>
::v-deep .el-steps--simple {
  padding: 13px 0;
  background-color: #fff
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
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

.orderInfo ::v-deep .el-collapse-item__wrap {
  border-bottom: none !important
}


.drawingNo {
  color: rgb(63, 185, 248);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  margin-top: 7px
}

.btn ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}

.planBox ::v-deep.el-table__body-wrapper {
  height: auto !important;
}

.JNPF-full-dialog-header {
  display: flex;
  padding: 10px 10px 0;
}

::v-deep.header-title {
  line-height: 46px;
  /* width: 200px; */
  flex: 0.5;
}

::v-deep .el-steps {
  flex: 2;
}

.options {
  line-height: 46px;
  text-align: right;
  flex: 1;
}

.orderInfo ::v-deep.el-collapse-item__wrap {
  padding-top: 10px;
}

::v-deep .el-tabs {
  height: calc(100% - 20px);
}

::v-deep.el-tab-pane {
  height: 100%
}

.dataTable {
  height: calc(100% - 70px);
}

.productInfo ::v-deep .el-collapse-item__wrap {
  padding: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px;
}

.pagination-container {
  margin-top: 0
}

.issForm ::v-deep .el-form-item__content {
  margin-left: 0 !important;
}
</style>
