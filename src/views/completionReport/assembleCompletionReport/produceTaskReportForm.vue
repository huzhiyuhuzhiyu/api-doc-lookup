<template>
  <div>
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType == 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" :content="'生产任务报工'" />
        <div class="options">

          <el-button @click="printBarCode">打印二维码</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">

        <el-collapse v-model="activeNames">
          <el-collapse-item title="任务信息" name="basicInfo" class="orderInfo" style="margin-top: 5px;">
            <div class="stoclInfo">
              <el-descriptions :column="1" class="box">
                <el-descriptions-item label="品名规格" class="drawingNo">{{ dataForm.productDrawingNo
                }}</el-descriptions-item>
              </el-descriptions>
              <el-descriptions class="margin-top" :column="4">
                <el-descriptions-item label="任务单号" class="orderNo">
                  {{ dataForm.orderNo }}</el-descriptions-item>

                <el-descriptions-item label="产品编码">{{ dataForm.productCode }}</el-descriptions-item>
                <el-descriptions-item label="产品分类">{{ dataForm.productCategoryName }}</el-descriptions-item>
                <el-descriptions-item label="总生产数量">{{ dataForm.productionQuantity }}</el-descriptions-item>
                <el-descriptions-item label="工艺名称">{{ dataForm.routingName }}</el-descriptions-item>
                <el-descriptions-item label="领料方式">{{ dataForm.pickingWay == 'production_order' ? '生产订单领料' : "工单领料"
                }}</el-descriptions-item>
                <el-descriptions-item :label="$store.getters.sealingCoverTyping"  v-if="sealingCoverTypingFlag === '1'">{{ dataForm.sealingCoverTyping
                }}</el-descriptions-item>
                <el-descriptions-item :label="$store.getters.accuracyLevel"  v-if="accuracyLevelFlag === '1'">{{ dataForm.accuracyLevel
                }}</el-descriptions-item>
                <el-descriptions-item label="振动等级" v-if="vibrationLevelFlag === '1'">{{ dataForm.vibrationLevel
                }}</el-descriptions-item>
                <el-descriptions-item label="油脂" v-if="oilFlag === '1'">{{ dataForm.oil }}</el-descriptions-item>
                <el-descriptions-item label="油脂量" v-if="oilQuantityFlag === '1'">{{ dataForm.oilQuantity
                }}</el-descriptions-item>
                <el-descriptions-item label="游隙" v-if="clearanceFlag === '1'">{{ dataForm.clearance
                }}</el-descriptions-item>
                <el-descriptions-item label="包装方式" v-if="packagingMethodFlag === '1'">{{ dataForm.packagingMethod
                }}</el-descriptions-item>
                <el-descriptions-item :label="$store.getters.specialRequire"  v-if="specialRequireFlag === '1'">{{ dataForm.specialRequire
                }}</el-descriptions-item>
                <el-descriptions-item label="保持架材质" v-if="materialFlag === '1'">{{ dataForm.material
                }}</el-descriptions-item>
                <el-descriptions-item :label="$store.getters.colour" v-if="colourFlag === '1'">{{ dataForm.colour }}</el-descriptions-item>
              </el-descriptions>
            </div>

          </el-collapse-item>
        </el-collapse>
        <div>
          <div class="process">
            <div v-for="(item, index) in workList" :key="index" class="workInfo"
              style="text-align: center;display: inline-block;">
              <div class="processInfoBox" style="cursor: pointer;"
                :class="item.processId == currentProcessId ? 'processInfo' : ''" @click="getProcessFun(item)">
                {{ item.processName }} <div>({{ item.processCode }})</div>
              </div>

            </div>
          </div>
          <el-col :span="11" class="fixedInfo" ref="fixedInfo" :style="{ height: targetHeight + 'px!important' }"
            style="width: 38%!important;position: relative;">
            <img src="@/assets/images/extend.png" alt="" v-if="processInfo.processingType == 'external_production'"
              class="extend">
            <img src="@/assets/images/noReport.png" alt=""
              v-if="processInfo.processingType == 'self_produced' && processInfo.reportFlag == false" class="extend">
            <el-row>
              <el-col :sm="24" :xs="24">

                <div class="info">
                  <span class="left-title">工单单号：</span>
                  <el-tooltip class="item" effect="dark" :content="processInfo.orderNo" placement="top-start">
                    <span class="left-title ts">
                      {{ processInfo.orderNo }}
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">工单类型：</span>
                  <span class="left-title" v-if="processInfo.processType == 'normal'">正常工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'vibrate'">测振工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'heat_treatment'">热工工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'packing'">包装工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'pairs'">配对工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'grinding'">磨孔工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'accuracy'">精度工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'fatInjection'">注脂工序</span>
                  <span class="left-title" v-if="processInfo.processType == 'boxing'">装盒工序</span>
                </div>
              </el-col>

              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">品名规格：</span>
                  <el-tooltip class="item" effect="dark" :content="processInfo.productDrawingNo" placement="top-start">
                    <span class="left-title ts">
                      {{ processInfo.productDrawingNo }}
                    </span>
                  </el-tooltip>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24">
                <div class="info">
                  <span class="left-title">加工工序：</span>
                  <span class="left-title">{{ processInfo.processName }}</span>
                </div>

              </el-col>


              <el-col :sm="24" :xs="24" v-if="sealingCoverTypingFlag === '1'">
                <div class="info">
                  <span class="left-title">打字内容：</span>
                  <span class="left-title">{{ processInfo.sealingCoverTyping }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="accuracyLevelFlag === '1'">
                <div class="info">
                  <span class="left-title">精度等级：</span>
                  <span class="left-title">{{ processInfo.accuracyLevel }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="vibrationLevelFlag === '1'">
                <div class="info">
                  <span class="left-title">振动等级：</span>
                  <span class="left-title">{{ processInfo.vibrationLevel }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="oilFlag === '1'">
                <div class="info">
                  <span class="left-title">油脂：</span>
                  <span class="left-title">{{ processInfo.oil }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="oilQuantityFlag === '1'">
                <div class="info">
                  <span class="left-title">油脂量：</span>
                  <span class="left-title">{{ processInfo.oilQuantity }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="clearanceFlag === '1'">
                <div class="info">
                  <span class="left-title">游隙：</span>
                  <span class="left-title">{{ processInfo.clearance }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="packagingMethodFlag === '1'">
                <div class="info">
                  <span class="left-title">包装方式：</span>
                  <span class="left-title">{{ processInfo.packagingMethod }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="specialRequireFlag === '1'">
                <div class="info">
                  <span class="left-title">特殊要求：</span>
                  <span class="left-title">{{ processInfo.specialRequire }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="materialFlag === '1'">
                <div class="info">
                  <span class="left-title">保持架材质：</span>
                  <span class="left-title">{{ processInfo.material }}</span>
                </div>

              </el-col>
              <el-col :sm="24" :xs="24" v-if="colourFlag === '1'">
                <div class="info">
                  <span class="left-title">颜色：</span>
                  <span class="left-title">{{ processInfo.colour }}</span>
                </div>

              </el-col>

            </el-row>
          </el-col>
          <el-col :span="12" class="rightInfo" :style="{ height: targetHeight2 + 'px!important' }" ref="mycol"
            v-if="currentProcess.processingType == 'self_produced' && currentProcess.reportFlag == true">
            <el-form ref="reportRef" :model="currentProcess" :rules="dataRule" label-width="180px"
              label-position="left">
              <el-row>
                <div style="margin-bottom: 10px; background: #f2f2f2; padding: 20px 16px;">
                  <span style="font-size: 17px;font-weight: bold">加工数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{
                      currentProcess.productionQuantity }}]</span>
                  <span style="font-size: 17px;font-weight: bold;margin-left: 10px;">可报工数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.waitReportNum
                    }}]</span>
                  <span style="font-size: 17px;font-weight: bold;margin-left: 10px;">报工数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.reportingQuantity
                    }}]</span>
                  <span
                    style="font-size: 17px;font-weight: bold;margin-left: 10px;display: inline-block;">不合格数量：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold">[{{ currentProcess.unqualifiedQuantity
                    }}]</span>
                  <span v-if="dataForm.pickingWay == 'dispatch_list'"
                    style="font-size: 17px;font-weight: bold;margin-left: 10px;display: inline-block;">可领库存数：</span><span
                    style="color: #3fb9f8;font-size: 17px;font-weight: bold"
                    v-if="dataForm.pickingWay == 'dispatch_list'">[{{ currentProcess.availableStockNum
                    }}]</span>
                </div>
                <div style="padding: 0 20px;">
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcessType === 4 || currentProcessType === 5">
                    <el-form-item label="配对方式" prop="pairingModeName">
                      <el-select v-model="currentProcess.pairingModeId" placeholder="请选择配对方式" style="width: 60%;"
                        clearable @input="handleClear" class="ipt" @change="(value) => changePairingMode(value)">
                        <el-option v-for="item in pairingModeList" size="small" :key="item.id" :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                      <span class="pairNum" v-if="currentProcess.pairingModeId">配对基本数量：{{ pairingModeNum }}</span>
                    </el-form-item>
                  </el-col>
                  <!-- //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序 -->
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcessType !== 1 && currentProcessType !== 6 && currentProcess.accuracyReportFlag">
                    <el-form-item label="精度等级:" prop="accuracyLevel" :style="{ marginBottom: producerMargin }">
                      <el-select v-model="currentProcess.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                        @change="(value) => handleSelectionChangeJD(value)" class="ipt">
                        <el-option v-for="(item, index) in accuracyLevelList" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcessType !== 1 && currentProcess.vibrateReportFlag && currentProcessType !== 6">
                    <el-form-item label="测振等级:" prop="vibrationLevel" :style="{ marginBottom: producerMargin }">
                      <el-select v-model="currentProcess.vibrationLevel" placeholder="请选择测振等级" style="width: 100%;"
                        @change="(value) => handleSelectionChangeZD(value)" class="ipt">
                        <el-option v-for="(item, index) in vibrationLevelList" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcessType ==2 && currentProcess.vibrateReportFlag &&currentProcess.projectId=='1862314777798295553'">
                    <el-form-item label="测振方式:" prop="vibrationType" :style="{ marginBottom: producerMargin }">
                      <el-select v-model="currentProcess.vibrationType" placeholder="请选择测振方式" style="width: 100%;" class="ipt">
                        <el-option v-for="(item, index) in vibrationTypeList" :key="index" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
       
                  <el-col :sm="24" :xs="24" v-if="currentProcessType === 4 || currentProcessType === 5">
                    <el-form-item label="总配对数量(对):" prop="matchedQuantity" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-input v-model="currentProcess.matchedQuantity" :disabled="!currentProcess.pairingModeId"
                        placeholder="总配对数量" class="ipt" @blur="countQualifiedQuantity" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="currentProcessType !== 6">
                    <el-form-item label="合格数量:" prop="qualifiedQuantity" class="iptLabel"
                      :style="{ marginBottom: iptLabelMargin }">
                      <el-input v-model="currentProcess.qualifiedQuantity"
                        v-if="currentProcessType === 4 || currentProcessType === 5"
                        :disabled="!!currentProcess.pairingModeId" placeholder="合格数量" class="ipt"
                        @blur="handleBlur()" />
                      <el-input v-model="currentProcess.qualifiedQuantity"
                        v-if="currentProcessType === 1 || currentProcessType === 2 || currentProcessType === 3"
                        placeholder="合格数量" class="ipt" @blur="handleBlur()" />
                    </el-form-item>
                  </el-col>

                  <!-- stockFlag 0否 继续生产 2包装入库 -->
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcessType !== 1 && currentProcess.reportFlag && currentProcessType !== 6">
                    <el-form-item label="是否入库:" prop="stockFlag">
                      <el-select v-model="stockFlag" placeholder="请选择是否入库" :disabled="currentProcess.lastFlag"
                        style="width: 100%;" class="ipt">
                        <el-option v-for="(item, index) in stockFlagList" :key="item.id" :label="item.fullName"
                          :value="item.value"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcess.processType === 'packing' && currentProcess.reportFlag">
                    <el-form-item label="包装方式:" prop="packagingMethod">
                      <el-select v-model="currentProcess.packagingMethod" placeholder="请选择包装方式" style="width: 100%;"
                        class="ipt">
                        <el-option v-for="(item, index) in packagingMethodList" :key="item.id" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcess.processType === 'fatInjection' && currentProcess.reportFlag">
                    <el-form-item label="注脂方式:" prop="oil">
                      <el-select v-model="currentProcess.oil" placeholder="请选择注脂方式" style="width: 100%;" class="ipt">
                        <el-option v-for="(item, index) in oilList" :key="item.id" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>


                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcess.processType === 'typing' && currentProcess.reportFlag">
                    <el-form-item label="打字内容:" prop="sealingCoverTyping">
                      <el-select v-model="currentProcess.sealingCoverTyping" placeholder="请选择打字内容" style="width: 100%;"
                        class="ipt">
                        <el-option v-for="(item, index) in sealingcoverTypingList" :key="item.id" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>

                    </el-form-item>
                  </el-col>

                  <el-col :sm="24" :xs="24" v-if="currentProcessType == 1"
                    :style="!currentProcess.vibrateReportFlag ? 'margin-top:5px' : ''">
                    <el-form-item label="责废数量:" class="iptLabel">
                      <el-input v-model="currentProcess.responsibilityWasteQuantity" disabled placeholder="责废数量"
                        @blur="handleBlur2" class="ipt materialWaste" />
                      <el-button type="primary" style="float: right;height: 50px" size="mini"
                        @click='setResponsWasteM()'>设置责废原因</el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" v-if="currentProcessType == 1">
                    <el-form-item label="料废数量:" class="iptLabel">
                      <el-input v-model="currentProcess.materialWasteQuantity" disabled placeholder="料废数量"
                        @blur="handleBlur3" class="ipt materialWaste" />
                      <el-button type="primary" style="float: right;height: 50px" size="mini"
                        @click='setMaterialWasteM()'>设置料废原因</el-button>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="24" :xs="24">
                    <el-form-item label="报工时间" class="iptLabel">
                      <el-date-picker v-model="currentProcess.reportingTime" value-format="yyyy-MM-dd"
                        @change="reportingTimeChange" class="ipt" type="date" style="width: 100%;" placeholder="选择报工时间">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="24" :xs="24" class="iptLabel">
                    <el-form-item label="生产人:" prop="producerId" v-if="currentProcess.taskMethod != 'not_appoint'"
                      :style="{ marginBottom: producerMargin }">
                      <el-select v-model="currentProcess.producerId" placeholder="生产人" style="width: 100%;"
                        class="ipt">
                        <el-option v-for="(item, index) in personList" :key="index" :label="item.label"
                          :value="item.id"></el-option>
                      </el-select>

                      <!-- producerId -->
                    </el-form-item>
                    <el-form-item label="生产人:" prop="producerId" v-if="currentProcess.taskMethod == 'not_appoint'"
                      :style="{ marginBottom: producerMargin }" class="iptLabel">
                      <user-select v-model="currentProcess.producerId" placeholder="生产人" clearable style="width: 100%;"
                        class="ipt" @change="hangleSelectSales">
                      </user-select>

                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="设备:" class="iptLabel">
                      <el-select v-model="currentProcess.equipmentId" placeholder="设备" style="width: 100%;" class="ipt">
                        <el-option v-for="(item, index) in equipmentList" :key="index" :label="item.resourceName"
                          :value="item.resourceId"></el-option>
                      </el-select>
                      <!-- equipmentId -->
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24" class="iptLabel"
                    v-if="currentProcessType == 6 && currentProcess.accuracyReportFlag">
                    <div style="width: 100%;">
                      <div style="width: 49%;display: inline-block;">
                        <p class="accTitle">02精度</p>
                        <JNPF-table v-loading="listLoading" ref="dataTable" custom-column :data="tableDataList"
                          :fixedNO="true">
                          <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" >
                            <template slot-scope="scope">
                              <el-select v-model="scope.row.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                                @change="(value) => handleSelectionChangeaccOne(scope, value)">
                                <el-option v-for="(item, index) in getFilteredAccuracyLevelList(scope.row)" :key="index"
                                  :label="item.name" :value="item.name"></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column prop="qualifiedQuantity" label="数量">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.qualifiedQuantity" />
                            </template>
                          </el-table-column>
                          <el-table-column label="操作" width="100" fixed="right">
                            <template slot-scope="scope">
                              <el-button size="mini" type="text" @click="addFun">新增</el-button>
                              <el-button size="mini" type="text" @click="delFun(scope)" style=" color: #ff3a3a"
                                :disabled="tableDataList.length === 1">删除</el-button>
                            </template>
                          </el-table-column>
                        </JNPF-table>
                      </div>

                      <div style="width: 49%;display: inline-block;margin-left: 2%;vertical-align: top;">
                        <p class="accTitle">01精度</p>
                        <JNPF-table v-loading="listLoading" ref="dataTables" custom-column :data="tableDataList2"
                          :fixedNO="true">
                          <el-table-column prop="accuracyLevel" :label="$store.getters.accuracyLevel" >
                            <template slot-scope="scope">
                              <el-select v-model="scope.row.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                                @change="selectAccuracyFun(scope)">
                                <el-option v-for="(item, index) in getFilteredAccuracyLevelList2(scope.row)"
                                  :key="index" :label="item.name" :value="item.name"></el-option>
                              </el-select>
                            </template>
                          </el-table-column>
                          <el-table-column prop="qualifiedQuantity" label="数量">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.qualifiedQuantity" />
                            </template>
                          </el-table-column>
                          <el-table-column prop="stockFlag" label="是否入库">
                            <template slot-scope="scope">
                              <el-select v-model="scope.row.stockFlag" placeholder="请选择是否入库"
                                :disabled="currentProcess.lastFlag" style="width: 100%;">
                                <el-option v-for="(item, index) in stockFlagList" :key="item.id" :label="item.fullName"
                                  :value="item.value"></el-option>
                              </el-select>
                            </template>
                          </el-table-column>

                          <el-table-column label="操作" width="100" fixed="right">
                            <template slot-scope="scope">
                              <el-button size="mini" type="text" @click="addFun2">新增</el-button>
                              <el-button size="mini" type="text" @click="delFun2(scope)" style=" color: #ff3a3a"
                                :disabled="tableDataList2.length === 1">删除</el-button>
                            </template>
                          </el-table-column>
                        </JNPF-table>
                      </div>
                    </div>
                    <!-- <el-form-item label="精度等级:" prop="accuracyLevel" :style="{ marginBottom: producerMargin }">
                      <el-select v-model="currentProcess.accuracyLevel" placeholder="请选择精度等级" style="width: 100%;"
                        @change="(value) => handleSelectionChangeJD(value)" class="ipt">
                        <el-option v-for="(item, index) in accuracyLevelList" :key="index" :label="item.name"
                          :value="item.name"></el-option>
                      </el-select>

                    </el-form-item> -->
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <div v-if="currentProcess.processingType == 'self_produced' && currentProcess.reportFlag == true"
                      style="margin-bottom: 20px;" class="reportBtn_right">
                      <el-button type="primary" size="mini" @click='report()'>报 工</el-button>
                      <el-button type="primary" size="mini" @click="reportRecordsFun()">查看报工记录</el-button>
                    </div>
                  </el-col>
                </div>


              </el-row>
            </el-form>
          </el-col>
          <el-col :span="12" class="rightInfo" style="padding-top: 18px;"
            :style="{ height: targetHeight2 + 'px!important' }"
            v-if="currentProcess.processingType == 'external_production'">
            <el-form ref="reportRef" :model="currentProcess" :rules="dataRule" label-width="180px"
              label-position="left">
              <el-row>

                <div style="padding: 0 20px;" class="external_text">

                  <el-descriptions :column="1">
                    <el-descriptions-item label="计划外协数量" class="external_cotent">
                      {{ currentProcess.productionQuantity }}
                    </el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="完工数量" class="external_cotent">{{
                      currentProcess.qualifiedQuantity ? currentProcess.qualifiedQuantity : 0
                    }}</el-descriptions-item>
                  </el-descriptions>
                  <el-descriptions :column="1">
                    <el-descriptions-item label="发料数量" class="external_cotent ">
                      <span class="mater">{{ dataForm.productionQuantity }}</span>

                    </el-descriptions-item>
                  </el-descriptions>
                </div>


              </el-row>
            </el-form>
          </el-col>
        </div>
      </div>


    </div>
    <NormalForm v-if="normalFormVisible" ref="normalForm" @close="closeForm"></NormalForm>
    <VibrateForm v-if="vibrateFormVisible" ref="VibrateForm" @close="closeForm"></VibrateForm>
    <recordForm v-if="recordFormVisible" ref="recordForm"></recordForm>
    <badReasonsForm v-if="badReasonsFormVisible" ref="badReasonsForm"></badReasonsForm>
    <MaterialWasteForm v-if="materialWasteFormVisible" ref="materialWasteFormRef" @change="materialWasteData">
    </MaterialWasteForm>
    <responsWaste v-if="responsWasteFormVisible" ref="responsWasteFormRef" @change="responsWasteData">
    </responsWaste>
    <PrintDialog :visible.sync="printVisible" @closePrint="closePrint" @printSubmit="printWarehouse"
      :printQuery="printQuery" :enCode="enCode" ref="printTemplate" append-to-body />
    <print-browse :visible.sync="printBrowseVisible" :id="prindId" :formId="formId" ref="printForm" />
  </div>
</template>

<script>

import {
  getbimProductAttributesList, getbimProductAttributes
} from "@/api/masterDataManagement/index";
import { detailProcess, getvibrationList, getPairingModelList, getaccuracyList } from '@/api/basicData/processSettingss.js'
import { detailordershengchan, getWorkList, addWorkReport } from '@/api/productOrdes/index.js'
import { producePersonList } from "@/api/warehouseManagement/packingList.js"
import { log } from 'mathjs'
import NormalForm from './NormalForm.vue'
import VibrateForm from './VibrateForm.vue'
import recordForm from './recordForm.vue'
import { getOrderFiledMap } from '@/api/basicData/index'
import badReasonsForm from './badReasonsForm.vue'
import MaterialWasteForm from '../ringCompletionReport/materialWasteForm.vue';
import responsWaste from '../ringCompletionReport/responsWaste.vue'
import PrintBrowse from '@/components/PrintBrowse'
import PrintDialog from '@/components/no_mount/printDialog'
import { getPrintBusInfo, getPrintDeliveryNote } from '@/api/system/printDev'

export default {

  components: {
    NormalForm, VibrateForm, recordForm, badReasonsForm, MaterialWasteForm, responsWaste, PrintBrowse,
    PrintDialog,
  },
  data() {
    return {
      printVisible: false,
      printBrowseVisible: false,
      enCode: "p035",
      fullName: "打印工单码",
      formId: "",
      responsWasteFormVisible: false,
      materialWasteFormVisible: false,
      badReasonsFormVisible: false,
      tableDataList: [
        { accuracyLevel: "", qualifiedQuantity: "" }
      ],
      accuracyLevelList2: [],
      tableDataList2: [
        { accuracyLevel: "", qualifiedQuantity: "", stockFlag: 0, }
      ],
      targetHeight: "",
      targetHeight2: "",
      processOutFormVisible: false,
      recordFormVisible: false,
      normalFormVisible: false,
      vibrateFormVisible: false,
      activeName: 'orderInfo',
      activeNames: ['basicInfo', 'productInfo'],
      orderTypeList: [
        { label: "正常任务", value: "normal", },
        { label: "返工任务", value: "rework", },
      ],
      dataForm: {
      },
      codeConfig: {},//单据规则配置
      workList: [],
      sealingcoverTypingList: [],
      oilList: [],
      processInfo: {},
      currentProcess: {},
      listLoading: false,
      currentProcessId: "",
      id: "",
      sort: "",//测震工序序号
      personList: [],
      totalReportNum: "",
      dataRule: {
        reportingTime: [
          { required: true, message: '报工时间不能为空', trigger: 'change' }
        ],
        producerId: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        accuracyLevel: [
          { required: true, message: '精度等级不能为空', trigger: 'change' }
        ],
        producerId: [
          { required: true, message: '生产人不能为空', trigger: 'change' }
        ],
        qualifiedQuantity: [
          { validator: this.formValidate({ type: "decimal", params: [20, 2, "请输入正确的数量(最多保留2位小数,整数8位)"], }), trigger: "blur", },
          // { validator: this.formValidate('noZero', '合格数量不能为0', (errMsg) => { this.$message.error(errMsg) }), trigger: 'blur' },
        ],
        vibrationLevel: [
          { required: true, message: '测振等级不能为空', trigger: 'change' }
        ],
      },
      iptLabelMargin: '28px',
      producerMargin: '28px',
      stockFlag: '',
      stockFlagList: [],
      vibrationLevelList: [],
      packagingMethodLiqqqqqqst: [],
      pairingModeList: [],
      pairingModeListCopy: [],
      pairingModeNum: 0,
      currentProcessType: 0,
      vibrationTypeList:[
        {label:"连线",value:"online"},
        {label:"单机",value:"alone"},
        {label:"手动",value:"manual"},
      ],
      // 属性字段  控制属性字段显示隐藏
      accuracyLevelFlag: "",
      clearanceFlag: "",
      oilFlag: "",
      oilQuantityFlag: "",
      packagingMethodFlag: "",
      sealingCoverTypingFlag: "",
      specialRequireFlag: "",
      vibrationLevelFlag: "",
      materialFlag: '',
      colourFlag: '',
      accuracyLevelList: [],
      copyCurrentProcess: {},
      materialWasteDataList: [],
      responsWasteDataList: [],
      equipmentList: [],
    }
  },

  async mounted() {

  },
  async mounted() {
    await this.getpairingModeListFun()
    this.getInboundVal()
    this.getOrderFiledMap()
    this.getPackmethods()
    this.getOilList()
    this.getsealingcoverTypingList()
  },
  methods: {
    closePrint() {
      this.printVisible = false
    },
    // 打印
    printBarCode() {
      this.formId = this.dataForm.id
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printTemplate.init(this.enCode)
      })
    },
    printWarehouse(enCode) {
      getPrintBusInfo(enCode).then(res => {
        if (res.data) {
          this.prindId = res.data.id
          this.printBrowseVisible = true
          this.printVisible = false

        } else {
          this.$message.warning('未找到相应打印模版')
        }
      }).catch(() => {
        this.printBrowseVisible = false
      });
    },

    setMaterialWasteM() {
      console.log("this.materialWasteDataList", this.materialWasteDataList);
      this.materialWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.materialWasteFormRef.init(JSON.parse(JSON.stringify(this.materialWasteDataList)), this.currentProcess.materialWasteQuantity, this.dataForm.projectId)
      })
    },
    // 设置责废原因
    setResponsWasteM() {
      console.log("this.responsWasteDataList", this.responsWasteDataList);
      this.responsWasteFormVisible = true
      this.$nextTick(() => {
        this.$refs.responsWasteFormRef.init(JSON.parse(JSON.stringify(this.responsWasteDataList)), this.currentProcess.responsibilityWasteQuantity, this.dataForm.projectId)
      })
    },
    materialWasteData(data, totalNums) {
      console.log("设置的料废金额", data, totalNums);
      this.materialWasteDataList = data
      if (totalNums) {
        this.currentProcess.materialWasteQuantity = totalNums
        this.handleBlur2()
      }
    },
    responsWasteData(data, totalNums) {
      console.log("责废数据", data, totalNums);
      this.responsWasteDataList = data
      if (totalNums) {
        this.currentProcess.responsibilityWasteQuantity = totalNums
        this.handleBlur2()
      }
    },
    // 选择02精度  再将选中的值赋值给到01精度可选项
    handleSelectionChangeaccOne(scope, value) {
      console.log("vaue", scope);
      //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
      const selectedItem = this.accuracyLevelList.find(item => item.name === value);
      console.log("selectedItem", selectedItem);
      this.$set(this.tableDataList[scope.$index], 'sortCode', selectedItem.sortCode)
      let arr = JSON.parse(JSON.stringify(this.tableDataList))
      console.log("asrr", arr);
      arr.sort((a, b) => a.sortCode - b.sortCode);
      console.log("arr", arr);
      let sort = arr[0].sortCode
      console.log("sort", sort);
      this.accuracyLevelList2 = this.accuracyLevelList.filter(item => item.sortCode >= sort);
    },
    // 过滤已选择的数据
    getFilteredAccuracyLevelList(currentRow) {
      // 生成当前行可以选择的精度等级列表  
      const selectedLevels = this.tableDataList
        .filter(row => row !== currentRow) // 排除当前行  
        .map(row => row.accuracyLevel); // 获取其他行的已选择项  

      return this.accuracyLevelList.filter(item => !selectedLevels.includes(item.name));
    },
    // 02精度新增
    addFun(scope) {
      let len = this.tableDataList.length
      if (len >= this.accuracyLevelList.length) return this.$message.error("表格数据条数已达到精度等级可选种类数量")
      this.tableDataList.push({ accuracyLevel: "", qualifiedQuantity: "", })
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = height + 49;
      });
    },
    // 02精度删除
    delFun(scope) {
      this.tableDataList.splice(scope.$index, 1)
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = height;
      });
      let nameToFind = scope.row.accuracyLevel
      if (!this.tableDataList2.length) return

      const index = this.tableDataList2.findIndex(item => item.accuracyLevel === nameToFind);

      // 输出结果  
      if (index !== -1) {
        this.tableDataList2[index] = { accuracyLevel: "", qualifiedQuantity: "" }
      } else {
      }
    },
    selectAccuracyFun(scope) {
      console.log(scope);
      if (scope.row.accuracyLevel === 'P0') {
        this.tableDataList2[scope.$index].stockFlag = 2
      } else {
        this.tableDataList2[scope.$index].stockFlag = 0

      }
    },
    // 过滤01精度已选择的数据
    getFilteredAccuracyLevelList2(currentRow) {
      // 生成当前行可以选择的精度等级列表  
      const selectedLevels = this.tableDataList2
        .filter(row => row !== currentRow) // 排除当前行  
        .map(row => row.accuracyLevel); // 获取其他行的已选择项  

      return this.accuracyLevelList2.filter(item => !selectedLevels.includes(item.name));
    },
    // 01精度新增
    addFun2(scope) {
      let len = this.tableDataList2.length
      // if (len >= this.tableDataList.length) return this.$message.error("表格数据条数已达到精度等级可选种类数量")
      this.tableDataList2.push({ accuracyLevel: "", qualifiedQuantity: "", stockFlag: 0, })
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = height + 49;
      });
    },
    // 01精度删除
    delFun2(scope) {
      this.tableDataList2.splice(scope.$index, 1)
      this.$nextTick(() => {
        const height = this.$refs.mycol.$el.clientHeight
        this.targetHeight = height + 49;
      });
    },
    // 获取是否入库下拉框
    getInboundVal() {
      this.$store.dispatch('base/getDictionaryData', { sort: 'NextProductionMethod' }).then((res) => {


        res.forEach(item => {
          if (item.enCode === "0") {
            this.$set(item, 'value', item.enCode * 1)
            this.stockFlagList = [...this.stockFlagList, item]
          }
          if (item.enCode === "2") {
            this.$set(item, 'value', item.enCode * 1)
            this.stockFlagList = [...this.stockFlagList, item]
          }
        });
        console.log("stock", this.stockFlagList);
        this.stockFlag = 0
      })
    },
    countQualifiedQuantity() {
      if (this.currentProcess.matchedQuantity) {
        this.totalReportNum = this.currentProcess.reportingQuantity = this.currentProcess.qualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('multiply', [this.currentProcess.matchedQuantity, this.pairingModeNum]), 2)
      }
    },
    // 定义当前工序的类型
    //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
    setProcessType() {
      if (this.currentProcess.vibrateReportFlag || this.currentProcess.accuracyReportFlag || this.currentProcess.pairsReportFlag) {
        if (this.currentProcess.processType == 'vibrate') {
          this.currentProcessType = 2
        } else if (this.currentProcess.processType == 'pairs') {
          this.currentProcessType = 4

        } else if (this.currentProcess.processType == 'accuracy') {
          this.currentProcessType = 6

        } else if (!this.currentProcess.pairsReportFlag) {
          this.currentProcessType = 3
        } else {
          this.currentProcessType = 5
        }
      } else {
        this.currentProcessType = 1
      }
      console.log(this.currentProcessType);
    },

    // 获取配对方式
    async getpairingModeListFun() {
      try {
        this.pairingModeList = await this.jnpf.getpairingModeListFun()
        this.pairingModeListCopy = JSON.parse(JSON.stringify(this.pairingModeList))
      } catch (error) { }


    },
    getOrderFiledMap() {
      getOrderFiledMap('sale').then((res) => {
        this.sealingCoverTypingFlag = res.data.sealingCoverTyping
        this.accuracyLevelFlag = res.data.accuracyLevel
        this.vibrationLevelFlag = res.data.vibrationLevel
        this.oilFlag = res.data.oil
        this.oilQuantityFlag = res.data.oilQuantity
        this.clearanceFlag = res.data.clearance
        this.packagingMethodFlag = res.data.packagingMethod
        this.specialRequireFlag = res.data.specialRequire
        this.materialFlag = res.data.material
        this.colourFlag = res.data.colour
      })
    },


    closeForm(flag) {
      if (flag) this.getRoutingDetailFun(this.dataForm.routingId)
    },
    init(id) {
      this.id = id
      detailordershengchan(id).then(res => {
        this.dataForm = res.data.prodOrder
        this.workList = res.data.workOrderList
        if (Object.keys(this.copyCurrentProcess).length !== 0) {
          const matchingItem = res.data.workOrderList.find(item => item.processId === this.copyCurrentProcess.processId);
          if (matchingItem) {
            this.currentProcessId = matchingItem.processId
            this.currentProcess = matchingItem
            this.processInfo = JSON.parse(JSON.stringify(matchingItem))
          } else {
          }
        } else {
          this.currentProcessId = res.data.workOrderList[0].processId
          this.currentProcess = res.data.workOrderList[0]
          this.processInfo = JSON.parse(JSON.stringify(res.data.workOrderList[0]))
        }

        this.$set(this.currentProcess, 'reportingQuantity', 0)
        this.$set(this.currentProcess, 'qualifiedQuantity', "")
        this.$set(this.currentProcess, 'unqualifiedQuantity', 0)
        this.$set(this.currentProcess, 'materialWasteQuantity', 0)
        this.$set(this.currentProcess, 'responsibilityWasteQuantity', 0)
        this.$set(this.currentProcess, 'reworkQuantity', 0)
        if (this.currentProcess.workOrderResMap && this.currentProcess.workOrderResMap.device) {

          this.equipmentList = this.currentProcess.workOrderResMap.device
        }
        if (this.currentProcess.processType == 'pairs') this.$set(this.currentProcess, 'pairsReportFlag', true)
        this.setProcessType()
        if (this.$store.getters.configData.produce.reporting_auto_recode) {
          this.currentProcess.qualifiedQuantity = this.currentProcess.waitReportNum
          this.currentProcess.reportingQuantity = this.currentProcess.waitReportNum
        }

        this.commonFun()
        // this.getRoutingDetailFun(this.dataForm.routingId)
      })
    },
    // 获取 可选的测振等级
    getReprotNum(id) {
      let obj = {
        workOrderId: this.currentProcess.id,
        pairingModeId: id,
      }
      getvibrationList(obj).then(res => {
        console.log("测振数据", res);
        this.vibrationLevelList = res.data
      })
    },
    // 获取 可选的精度等级
    getReprotNumJD(id) {
      let obj = {
        workOrderId: this.currentProcess.id,
        pairingModeId: id,
      }
      getaccuracyList(obj).then(res => {
        console.log("精度数据", res);
        this.accuracyLevelList = res.data
      })
    },

    handleSelectionChangeZD(value) {
      console.log("value", value);
      if (this.currentProcessType !== 2) {
        //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
        const selectedItem = this.vibrationLevelList.find(item => item.name === value);
        console.log("selectedItem", selectedItem);
        this.currentProcess.waitReportNum = selectedItem.waitReportNum
      }


    },
    handleSelectionChangeJD(value) {
      console.log("value", value);
      if (this.currentProcessType !== 6) {
        //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
        const selectedItem = this.accuracyLevelList.find(item => item.name === value);
        console.log("selectedItem", selectedItem);
        this.currentProcess.waitReportNum = selectedItem.waitReportNum
      }


    },
    handleClear(value) {
      console.log("value", value);
      if (value === '') {
        this.currentProcess.pairingModeId = ""
        this.pairingModeNum = 0
        this.currentProcess.matchedQuantity = ''
        this.currentProcess.qualifiedQuantity = ''
        this.currentProcess.reportingQuantity = 0
        // 这里可以执行清除操作后的逻辑
      }
      console.log("aaa", this.currentProcess);
    },
    changePairingMode(value) {
      console.log("bbb", value);
      if (value) {
        console.log(this.pairingModeListCopy);
        this.pairingModeNum = this.pairingModeListCopy.filter(items => items.id === value)[0].quantity;
        if(this.currentProcessType!==4){
          this.currentProcess.waitReportNum = this.pairingModeList.filter(items => items.id === value)[0].waitReportNum
        }
        this.currentProcess.qualifiedQuantity = ''
        this.currentProcess.reportingQuantity = 0
        if (this.currentProcessType !== 4) {

          this.getReprotNum(this.currentProcess.pairingModeId)
        }
      } else {
        this.currentProcess.pairingModeId = ""
      }
      this.currentProcess.vibrationLevel = ""
    },
    // 获取上一道工序的配对方式 配对工序后面的可用
    getPrvePairingModelListFun() {
      let obj = {
        workOrderId: this.currentProcess.id,
        vibrationLevel: "",
      }
      getPairingModelList(obj).then(res => {
        console.log("上一道配对方式", res);
        this.currentProcess.pairingModeId = ""
        this.pairingModeNum = ""
        this.pairingModeList = res.data
      })
    },
    async getProcessFun(item) {
      this.$set(item,'matchedQuantity','')
      this.currentProcess = item
      this.copyCurrentProcess = JSON.parse(JSON.stringify(item))
      if (this.currentProcess.processType == 'pairs') this.$set(this.currentProcess, 'pairsReportFlag', true)
      console.log("当前点击的工序", item);
      this.$nextTick(() => {
        if (item.reportFlag) this.$refs['reportRef'].clearValidate()
      })

      this.setProcessType()
      this.currentProcess.pairingModeId = ''
      this.stockFlag = 0
      //1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
      if (this.currentProcessType == 5) {
        this.currentProcess.pairingModeId = ''
        this.getPrvePairingModelListFun()
      }
      if (this.currentProcessType == 4) {
        await this.getpairingModeListFun()
      }
      if (this.currentProcess.lastFlag === true) {
        this.stockFlag = 2

      }
      console.log("object,this", this.stockFlag, this.currentProcessType);
      this.targetHeight = ""
      this.targetHeight2 = ""
      this.commonFun()
      this.processInfo = JSON.parse(JSON.stringify(item))
      if (item.vibrateReportFlag === true && item.processType !== 'vibrate') {
        console.log("进来了");
        this.getReprotNum('')
      }
      if (item.accuracyReportFlag === true && item.processType !== "accuracy") {
        console.log("进来了2");
        this.getReprotNumJD('')
      }
      console.log("配对方式", this.pairingModeList, item.pairingModeId);
      if (this.currentProcess.pairingModeId && this.pairingModeList.length) this.pairingModeNum = this.pairingModeList.filter(items => items.id === item.pairingModeId)[0].quantity;
      this.currentProcessId = item.processId
      this.$set(this.currentProcess, 'reportingQuantity', 0)
      this.$set(this.currentProcess, 'qualifiedQuantity', "")
      this.$set(this.currentProcess, 'unqualifiedQuantity', 0)
      this.$set(this.currentProcess, 'materialWasteQuantity', 0)
      this.$set(this.currentProcess, 'responsibilityWasteQuantity', 0)
      this.$set(this.currentProcess, 'reworkQuantity', 0)
      // this.$set(this.currentProcess, 'vibrationLevel', "")
      console.log("当前current", item);


    },

    handleBlur() {
      let total
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)
    },
    handleBlur2() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      let total
      if (this.currentProcess.item) {
        total = Object.values(this.currentProcess.item)
          .map(Number) // 将每个值转换为数字  
          .reduce((acc, curr) => acc + curr, 0); // 使用 reduce 方法计算总和
      } else {
        total = this.currentProcess.qualifiedQuantity
      }
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [total, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)
    },
    handleBlur3() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      let total
      if (this.currentProcess.item) {
        total = Object.values(this.currentProcess.item)
          .map(Number) // 将每个值转换为数字  
          .reduce((acc, curr) => acc + curr, 0); // 使用 reduce 方法计算总和
      } else {
        total = this.currentProcess.qualifiedQuantity
      }
      this.totalReportNum = this.jnpf.numberFormat(this.jnpf.math('add', [total, this.currentProcess.unqualifiedQuantity]), 6)
      this.$set(this.currentProcess, 'reportingQuantity', this.totalReportNum)
    },
    reportingTimeChange(e) {
      this.currentProcess.reportingTime = e + ' 00:00:00'
    },
    // 获取振动等级数据
    getvibrationLevelFun() {
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa005",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj3).then(res => {
        this.vibrationLevelList = res.data.records

        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })

    },
    commonFun() {
      this.currentProcess.unqualifiedQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.materialWasteQuantity, this.currentProcess.responsibilityWasteQuantity]), 6)
      // 如果是测振工序 则获取测振工序等级
      if (this.currentProcessType === 2 && this.currentProcess.vibrateReportFlag) {
        this.getvibrationLevelFun()

      }
      // 如果是精度工序 则获取精度工序等级
      if (this.currentProcessType === 6 && this.currentProcess.accuracyReportFlag) {
        console.log("精度工序");
        this.getaccuracyFun()

      }

      if (this.currentProcess.processingType == 'self_produced' && this.currentProcess.reportFlag == true) {

        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      } else {
        const height = this.$refs.fixedInfo.$el.clientHeight
        this.targetHeight2 = height;
      }
      this.producePersonListFun(this.currentProcess.id)
      const end = new Date();//获取当前的日期
      this.$set(this.currentProcess, 'reportingTime', this.dateFormat(end))
    },

    // 获取生产人员数据
    producePersonListFun(id) {
      producePersonList(id).then(res => {

        if (res.data) {
          let result = Object.entries(res.data).map(([key, value]) => {
            return {
              id: key,
              label: value
            };
          });
          this.personList = result
          console.log(result);
          if (result.length > 0) {
            this.$set(this.currentProcess, 'producerId', result[0].id)
            this.$set(this.currentProcess, 'producerName', result[0].label)


          }

        }
      })
    },
    // 获取精度等级
    getaccuracyFun() {
      let obj3 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa006",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj3).then(res => {
        this.accuracyLevelList = res.data.records
        console.log("精度等级", res);
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })

    },

    // 获取包装方式
    getPackmethods() {
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa015",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj4).then(res => {
        this.packagingMethodList = res.data.records
        console.log("this.包装方式", this.packagingMethodList);
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })
    },
    // 获取注脂方式
    getOilList() {
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa002",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj4).then(res => {
        this.oilList = res.data.records
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })
    },
    // 获取打字内容
    getsealingcoverTypingList() {
      let obj4 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa007",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ]
      };
      getbimProductAttributesList(obj4).then(res => {
        this.sealingcoverTypingList = res.data.records
        this.$nextTick(() => {
          const height = this.$refs.mycol.$el.clientHeight
          this.targetHeight = height;
        });
      })
    },
    goBack() {
      this.$emit("close", false)
    },

    reportRecordsFun() {
      this.recordFormVisible = true
      this.$nextTick(() => {
        this.$refs.recordForm.init(this.currentProcess.orderNo)
      })
    },
    isPositiveInteger(num) {
      return /^\d+$/.test(num);
    },
    // 报工
    report() {
      // 先判断是否有测震工序(sort有值表示有测震工序)  
      // 如果有 拿当前工序排序值大于等于测震工序值 则表示是测震工序或测震后工序
      // 如果没有 则是测震前工序

      this.$refs['reportRef'].validate((valid) => {
        if (valid) {
          let submitFlag = null
          if (this.totalReportNum > Number(this.currentProcess.waitReportNum)) {
            submitFlag = false
            this.$message.error("合格数量加上不合格数量不能超过可报工数量")
            return
          }
          if (this.currentProcess.reportFlag) {
            if (!this.totalReportNum) {
              submitFlag = false
              this.$message.error("合格数量加上不合格数量必须大于0")
              return
            }
          }
          if (this.currentProcess.reportFlag && this.currentProcess.accuracyReportFlag && this.currentProcessType !== 6) {
            if (!this.currentProcess.qualifiedQuantity) return this.$message.error("合格数量不能为空")
          }
          // 精度工序相关判断
          if (this.currentProcessType === 6 && this.currentProcess.reportFlag && this.currentProcess.accuracyReportFlag) {
            console.log(123);
            // 使用 every 方法检查是否所有 accuracyLevel 都为空
            var totalQualifiedQuantity, totalQualifiedQuantity2;
            if (this.tableDataList.length) {
              const allAccuracyLevelEmpty = this.tableDataList.every(item => item.accuracyLevel === "");
              if (allAccuracyLevelEmpty) {
                this.$message.error("请选择02精度等级")
                submitFlag = false
                return
              }
              for (let index = 0; index < this.tableDataList.length; index++) {
                const item = this.tableDataList[index];
                if (item.accuracyLevel && !item.qualifiedQuantity) {
                  this.$message({
                    message: "请输入02精度表格第" + (index + 1) + "行数量",
                    type: 'error',
                    duration: 1500,
                  })
                  submitFlag = false
                  break
                }
              }
              totalQualifiedQuantity = this.tableDataList.reduce((sum, item) => {
                return sum + parseInt(item.qualifiedQuantity, 10); // 将字符串转换为数字并累加  
              }, 0);
              if (totalQualifiedQuantity > this.currentProcess.waitReportNum) {
                this.$message.error("02精度总数量不能超过可报工数量")
                return
              }
            }
            if (this.tableDataList2.length) {
              const allAccuracyLevelEmpty2 = this.tableDataList2.every(item => item.accuracyLevel === "");
              if (allAccuracyLevelEmpty2) {
                this.$message.error("请选择01精度等级")
                submitFlag = false
                return
              }
              for (let index = 0; index < this.tableDataList2.length; index++) {
                const item = this.tableDataList2[index];
                if (item.accuracyLevel && !item.qualifiedQuantity) {
                  this.$message({
                    message: "请输入01精度表格第" + (index + 1) + "行数量",
                    type: 'error',
                    duration: 1500,
                  })
                  submitFlag = false
                  break
                }
              }
              totalQualifiedQuantity2 = this.tableDataList2.reduce((sum, item) => {
                return sum + parseInt(item.qualifiedQuantity, 10); // 将字符串转换为数字并累加  
              }, 0);
              if (totalQualifiedQuantity2 > totalQualifiedQuantity) {
                this.$message.error("01精度总数量不能超过02精度总数量")
                return
              }
            }
          }

          if ((this.currentProcessType === 4 || this.currentProcessType === 5) && this.currentProcess.pairingModeId) {
            console.log(1234);
            if (!this.currentProcess.matchedQuantity) return this.$messagea.error("总配对数量不能为空")
            let flag = this.isPositiveInteger(this.currentProcess.matchedQuantity)
            if (!flag) this.$message.error("总配对数量不能有小数")
            if (!flag) submitFlag = false
          }
          if (submitFlag === false) return
          console.log(12345);
          let arr = []
          if (this.currentProcess.vibrateReportFlag || this.currentProcess.pairsReportFlag) {
            let obj = {}
            if (this.currentProcessType === 2) {//1 为正常工序 2为测振工序  3为测振到配对之间的工序 4为配对工序 5为配对后工序 6为精度工序
              // 测震工序
              console.log("测震工序");
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = this.currentProcess.reworkQuantity
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.currentProcess.reportingQuantity
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.packagingMethod = this.currentProcess.packagingMethod
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              
              obj.workOrderId = this.currentProcess.id
              obj.stockFlag = this.stockFlag
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
            } else if (this.currentProcessType === 3) {
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = 0
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.currentProcess.reportingQuantity
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              obj.workOrderId = this.currentProcess.id
              obj.packagingMethod = this.currentProcess.packagingMethod
              obj.stockFlag = this.stockFlag
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              console.log("测震到配对工序之间的工序");
            } else if (this.currentProcessType === 4) {
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = this.currentProcess.reworkQuantity
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity,]), 6)
              obj.packagingMethod = this.currentProcess.packagingMethod
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              obj.workOrderId = this.currentProcess.id
              obj.matchedQuantity = this.currentProcess.matchedQuantity
              obj.pairingModeId = this.currentProcess.pairingModeId
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              console.log("配对工序");
            } else {
              console.log("配对后工序");
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = this.currentProcess.reworkQuantity
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
              obj.packagingMethod = this.currentProcess.packagingMethod
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              obj.workOrderId = this.currentProcess.id
              obj.matchedQuantity = this.currentProcess.matchedQuantity
              obj.pairingModeId = this.currentProcess.pairingModeId
              obj.oil = this.currentProcess.oil
              obj.sealingCoverTyping = this.currentProcess.sealingCoverTyping
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
            }
            arr.push(obj)
          } else if (this.currentProcess.accuracyReportFlag) {
            if (this.currentProcessType === 6) {
              console.log("this.table", this.tableDataList2);
              this.tableDataList2.forEach(item => {
                let obj = {}
                this.$set(obj, 'classAttribute', this.currentProcess.classAttribute)
                this.$set(obj, 'orderType', this.currentProcess.orderType)
                this.$set(obj, 'productDrawingNo', this.currentProcess.productDrawingNo)
                this.$set(obj, 'processName', this.currentProcess.processName)
                this.$set(obj, 'productionQuantity', this.currentProcess.productionQuantity)
                this.$set(obj, 'equipmentId', this.currentProcess.equipmentId)
                this.$set(obj, 'remark', this.currentProcess.remark)
                this.$set(obj, 'reportingTime', this.currentProcess.reportingTime)
                this.$set(obj, 'reworkQuantity', this.currentProcess.reworkQuantity)
                this.$set(obj, 'responsibilityWasteQuantity', this.currentProcess.responsibilityWasteQuantity)
                this.$set(obj, 'materialWasteQuantity', this.currentProcess.materialWasteQuantity)
                this.$set(obj, 'pricingType', this.currentProcess.pricingType)
                this.$set(obj, 'processId', this.currentProcess.processId)
                this.$set(obj, 'producerId', this.currentProcess.producerId)
                this.$set(obj, 'productionOrderId', this.currentProcess.productionOrderId)
                this.$set(obj, 'qualifiedQuantity', item.qualifiedQuantity)
                this.$set(obj, 'reportingQuantity', item.qualifiedQuantity)
                this.$set(obj, 'stockFlag', item.stockFlag)
                this.$set(obj, 'reportingType', 'normal')
                this.$set(obj, 'unqualifiedQuantity', this.currentProcess.unqualifiedQuantity)
                this.$set(obj, 'vibrationLevel', this.currentProcess.vibrationLevel)
                this.$set(obj, 'vibrationType', this.currentProcess.vibrationType)
              this.$set(obj, 'workOrderId', this.currentProcess.id)
                this.$set(obj, 'matchedQuantity', this.currentProcess.matchedQuantity)
                this.$set(obj, 'pairingModeId', this.currentProcess.pairingModeId)
                this.$set(obj, 'accuracyLevel', item.accuracyLevel)
                this.$set(obj, 'causesList', [...this.materialWasteDataList, ...this.responsWasteDataList])

                this.$set(obj, 'packagingMethod', this.currentProcess.packagingMethod)



                arr.push(obj)
                console.log("精度报工", arr);
              })
            } else if (this.currentProcessType === 3) {
              let obj = {}
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = 0
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.currentProcess.reportingQuantity
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              obj.workOrderId = this.currentProcess.id
              obj.packagingMethod = this.currentProcess.packagingMethod
              obj.stockFlag = this.stockFlag
              obj.accuracyLevel = this.currentProcess.accuracyLevel
              obj.oil = this.currentProcess.oil
              obj.sealingCoverTyping = this.currentProcess.sealingCoverTyping
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              arr.push(obj)
              console.log("测震到配对工序之间的工序");
            } else if (this.currentProcessType === 4) {
              let obj = {}
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = this.currentProcess.reworkQuantity
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              obj.workOrderId = this.currentProcess.id
              obj.matchedQuantity = this.currentProcess.matchedQuantity
              obj.pairingModeId = this.currentProcess.pairingModeId
              obj.accuracyLevel = this.currentProcess.accuracyLevel
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              obj.packagingMethod = this.currentProcess.packagingMethod
              arr.push(obj)
              console.log("配对工序");
            } else {
              let obj = {}
              console.log("配对后工序");
              obj.classAttribute = this.currentProcess.classAttribute
              obj.orderType = this.currentProcess.orderType
              obj.productDrawingNo = this.currentProcess.productDrawingNo
              obj.processName = this.currentProcess.processName
              obj.productionQuantity = this.currentProcess.productionQuantity
              obj.equipmentId = this.currentProcess.equipmentId
              obj.remark = this.currentProcess.remark
              obj.reportingTime = this.currentProcess.reportingTime
              obj.reworkQuantity = this.currentProcess.reworkQuantity
              obj.responsibilityWasteQuantity = this.currentProcess.responsibilityWasteQuantity
              obj.materialWasteQuantity = this.currentProcess.materialWasteQuantity
              obj.pricingType = this.currentProcess.pricingType
              obj.processId = this.currentProcess.processId
              obj.producerId = this.currentProcess.producerId
              obj.productionOrderId = this.currentProcess.productionOrderId
              obj.qualifiedQuantity = this.currentProcess.qualifiedQuantity
              obj.reportingQuantity = this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity]), 6)
              obj.reportingType = "normal"
              obj.unqualifiedQuantity = this.currentProcess.unqualifiedQuantity
              obj.vibrationLevel = this.currentProcess.vibrationLevel
              obj.vibrationType = this.currentProcess.vibrationType
              obj.workOrderId = this.currentProcess.id
              obj.matchedQuantity = this.currentProcess.matchedQuantity
              obj.pairingModeId = this.currentProcess.pairingModeId
              obj.accuracyLevel = this.currentProcess.accuracyLevel
              obj.oil = this.currentProcess.oil
              obj.sealingCoverTyping = this.currentProcess.sealingCoverTyping
              obj.causesList = [...this.materialWasteDataList, ...this.responsWasteDataList]
              obj.packagingMethod = this.currentProcess.packagingMethod
              arr.push(obj)
            }
          } else {
            let obj = {
              "classAttribute": this.currentProcess.classAttribute,
              orderType: this.currentProcess.orderType,
              productDrawingNo: this.currentProcess.productDrawingNo,
              processName: this.currentProcess.processName,
              productionQuantity: this.currentProcess.productionQuantity,
              equipmentId: this.currentProcess.equipmentId,
              remark: this.currentProcess.remark,
              reportingTime: this.currentProcess.reportingTime,
              reworkQuantity: this.currentProcess.reworkQuantity,
              responsibilityWasteQuantity: this.currentProcess.responsibilityWasteQuantity,
              "materialWasteQuantity": this.currentProcess.materialWasteQuantity,
              "pricingType": this.currentProcess.pricingType,
              "processId": this.currentProcess.processId,
              "producerId": this.currentProcess.producerId,
              "productionOrderId": this.currentProcess.productionOrderId,
              "qualifiedQuantity": this.currentProcess.qualifiedQuantity,
              "reportingQuantity": this.jnpf.numberFormat(this.jnpf.math('add', [this.currentProcess.qualifiedQuantity, this.currentProcess.unqualifiedQuantity,]), 6),
              "reportingType": "normal ",
              "unqualifiedQuantity": this.currentProcess.unqualifiedQuantity,
              "vibrationLevel": this.currentProcess.vibrationLevel,
              "vibrationType": this.currentProcess.vibrationType,
              "oil": this.currentProcess.oil,
              "sealingCoverTyping": this.currentProcess.sealingCoverTyping,
              "workOrderId": this.currentProcess.id,
              causesList: [...this.materialWasteDataList, ...this.responsWasteDataList],
              packagingMethod: this.currentProcess.packagingMethod

            }
            arr.push(obj)
          }

          addWorkReport(arr).then(res => {
            this.$message.success("报工成功")
            if(this.currentProcessType!==4){
              this.getPrvePairingModelListFun()
            }
            this.getReprotNumJD('')
            this.getReprotNum('')
            this.materialWasteDataList = []
            this.responsWasteDataList = []
            this.init(this.id)
          })
        } else {
          // if (!this.currentProcess.vibrateReportFlag) {
          //   if (!this.currentProcess.qualifiedQuantity || this.currentProcess.qualifiedQuantity == 0) {
          //     this.iptLabelMargin = '24px'
          //   } else {
          //     this.iptLabelMargin = '24px'

          //   }
          // }
          // if (!this.currentProcess.producerId) {
          //   this.producerMargin = '24px'
          // } else {
          //   this.producerMargin = '24px'

          // }
          this.$nextTick(() => {
            const height = this.$refs.mycol.$el.clientHeight
            this.targetHeight = height;
          });
        }
      })


    },
    // 选择生产人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.reportRef.validateField('producerId')
      })
      this.currentProcess.producerId = e
    },
    dateFormat(dateData) {
      var date = new Date(dateData);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var hours = date.getHours().toString().padStart(2, "0");
      var minutes = date.getMinutes().toString().padStart(2, "0");
      var seconds = date.getSeconds().toString().padStart(2, "0");
      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return formattedDate
    },
  }
}
</script>
<style lang="scss" scoped>
// .main {
//   padding: 10px 30px 0;
// }
::v-deep .handle-mr {
  display: block !important;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
  margin-bottom: 10px
}




::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0;
}

::v-deep .JNPF-common-page-header.noButtons {
  padding: 9px 10px;
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

.JNPF-preview-main .main {
  padding-top: 0;
  margin-bottom: 10px;
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
  padding: 0px;
  height: calc(100% - 48px);

}

::v-deep .el-collapse-item__content {
  height: 100%;
}

.reportInfo ::v-deep .el-collapse-item__wrap {
  padding: 0;
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

.orderInfo {
  height: 100%;
}

.eol {
  height: 100%;
  border-right: 1px solid #dcdfe6;
  background: #f5f7fa;
  padding-left: 10px;
}

.options {
  display: inline-block;
  float: right;
}

.pageTitle {
  display: inline-block;
  font-size: 18px;
  color: #303133;
  height: 100%;
  line-height: 36px;
  font-weight: 700;
}

.setipImg {
  width: 60px;
  height: 60px;
}

.reportBox_left {
  /* padding-right: 10px; */
  /* margin-right: 15px; */
  background: #fff;
  /* margin-right: 5px; */
  padding-right: 10px;
  box-sizing: border-box;
  border-right: 5px solid #ebeef5;
  padding: 10px 0 0px 0;
  width: 220px;
  height: 640px;
  display: inline-block;
  overflow-y: auto;
}

.reportBox_left::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}

.processInfoBox {
  background-image: url('../../../assets/images/success2.png');
  /* width: 90%; */
  /* height: 80px; */
  width: 160px;
  height: 50px;
  background-size: 100% 100%;
  margin: 0 auto;
  /* line-height: 80px; */
  /* border-radius: 2px; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 20px;
  box-sizing: border-box;
  font-size: 16px;
  padding-right: 20px;
  padding-top: 6px;
  line-height: 19px;
}

.processInfo {
  background-image: url('../../../assets/images/NotStarted3.png');
  margin: 0 auto;
  border-radius: 2px;
  color: #fff;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
}

.info {
  display: inline-block;
  vertical-align: top;
  overflow-y: auto;

}

.info ::v-deep .el-form {
  padding-left: 10px;
  padding-right: 10px;
  background: #ffa07a;
}

.information ::v-deep.el-form {
  padding-left: 10px;
  padding-right: 10px;
  background: #add8e6;
}

.reportBtn {
  // text-align: center;
  margin-top: 20px;
}

.tit {
  background: #fafafa;
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  font-weight: 600;
  padding: 0 10px;
}

.info::-webkit-scrollbar {
  display: none;
  /* 对于 Chrome, Safari 和 Opera 的写法 */
}

.el-card {
  border: 0;
  border-top: 1px solid #EBEEF5;
}

box-card:nth-child(n+3) {
  margin-top: 10px
}

.workInfo:nth-child(n+2) {
  margin-left: -8px;
}

.taskInfo ::v-deep.el-form-item {
  margin-bottom: 0;
}

.taskInfo::v-deep .el-form-item__content {
  line-height: 40px !important;
}

.taskInfo::v-deep .el-form-item__label {
  line-height: 40px !important;

}

.taskInfo ::v-deep.el-form-item__content div {
  width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .el-col .el-form-item--small .el-form-item__content {
  line-height: 32px;
}

.stoclInfo {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);
  padding: 5px;
}

.stoclInfo .margin-top {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);

}

.orderInfo::v-deep .el-descriptions-item__label {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.orderInfo::v-deep .el-descriptions-item__content {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block !important;
}

.orderInfo ::v-deep .el-descriptions__table {
  background: linear-gradient(0deg, #11B481 0%, #6ADE7D 100%);
}

.box ::v-deep .el-descriptions__table {
  background: #6ADE7D;
}

.info {
  margin-top: 18px;
}

.fixedInfo {
  background: linear-gradient(0deg, #11B481 0.00%, #6ADE7D 100.00%);
  padding: 20px;
  color: #fff;
  padding: 20px;
  color: #fff;
  padding-top: 0;
  border-bottom: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}

.rightInfo {
  width: 62%;
  /* border: 1px solid; */
  border-radius: 4px;
  // margin-left: 20px;
  float: right;
  box-shadow: beige;
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}

.ipt ::v-deep.el-input__inner {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
  padding-right: 0;
  border: 0;
}

.iptLabel ::v-deep.el-form-item__label {
  height: 50px;
  line-height: 50px;
  font-size: 20px !important;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 0;
}

.rightInfo ::v-deep .el-form-item--small.el-form-item {
  border: 1px solid #ebeef5;
}

.JNPF-common-drawer ::v-deep.el-drawer__body {
  overflow-y: auto;
}

.ts {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.JNPF-dialog.JNPF-dialog_center ::v-deep.el-dialog .el-dialog__body {
  padding: 10px !important;
}

.left-title {
  font-size: 18px;
  font-weight: 600;
}

.reportBtn ::v-deep .el-button {

  line-height: 40px;
  background: #fff;
  color: #3fb9f8;
}

.reportBtn ::v-deep .el-button span {
  font-size: 18px !important;
  font-weight: bold;
}

.reportBtn_right .el-button {

  line-height: 40px;

}

.reportBtn_right ::v-deep .el-button span {
  font-size: 18px !important;
  font-weight: bold;
}

.process {
  padding-top: 5px;
  padding: 0px 10px;
  border: 1px solid #dcdfe6;
  padding-top: 5px;
  background: #f2f2f2;
}

.extend {
  width: 150px;
  position: absolute;
  right: 10px;
  top: 10px;
}

.external_text ::v-deep .el-descriptions-item__content,
.external_text ::v-deep .el-descriptions-item__label {
  font-size: 18px;
  font-weight: bold;
}

::v-deep .el-form-item__error {
  font-size: 16px !important;
  margin: 8px 0
}

.pairNum {
  display: inline-block;
  height: 50px;
  float: right;
  padding-right: 10px;
  line-height: 50px;
  background: #3fb9f8;
  padding-left: 10px;
  font-size: 18px;
  color: #fff;
}

::v-deep .el-table--scrollable-y .el-table__body-wrapper {
  height: auto !important;
}

.accTitle {
  height: 45px;
  line-height: 45px;
  background: rgb(242, 242, 242);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.materialWaste {
  width: 70%;
}
</style>