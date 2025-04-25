<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" :content="title" />
          <div class="options">
            <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              提交</el-button>
            <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="任务信息" name="orderInfo" v-if="btnType == 'all'">
              <el-collapse v-model="activeNames1">
                <el-collapse-item title="任务信息" name="basicInfo">

                  <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产任务单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="任务类型" prop="orderType">
                          <el-select v-model="dataForm.orderType" placeholder="任务类型" clearable style="width: 100%;"
                            disabled>
                            <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="品名规格" prop="productDrawingNo">
                          <el-input v-model="dataForm.productDrawingNo" placeholder="品名规格" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>




                      <el-col :sm="8" :xs="24">
                        <el-form-item label="产品编码" prop="productCode">
                          <el-input v-model="dataForm.productCode" placeholder="产品编码" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="单位" prop="mainUnit">
                          <el-input v-model="dataForm.mainUnit" placeholder="单位" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="总生产数量" prop="productionQuantity">
                          <el-input v-model="dataForm.productionQuantity" placeholder="总生产数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="已完成数量" prop="completedQuantity">
                          <el-input v-model="dataForm.completedQuantity" placeholder="已完成数量" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="工艺路线名称" prop="routingName">
                          <el-input v-model="dataForm.routingName" placeholder="工艺路线名称" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="工艺路线编码" prop="routingCode">
                          <el-input v-model="dataForm.routingCode" placeholder="工艺路线名称" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="$store.getters.sealingCoverTyping"  prop="sealingCoverTyping">
                          <el-input v-model="dataForm.sealingCoverTyping" placeholder="打字内容" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="$store.getters.accuracyLevel"  prop="accuracyLevel">
                          <el-input v-model="dataForm.accuracyLevel" placeholder="精度等级" disabled></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="振动等级" prop="vibrationLevel">
                          <el-input v-model="dataForm.vibrationLevel" placeholder="振动等级" disabled></el-input>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="油脂" prop="oil">
                          <el-input v-model="dataForm.oil" placeholder="油脂" disabled></el-input>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="油脂量" prop="oilQuantity">
                          <el-input v-model="dataForm.oilQuantity" placeholder="油脂量" disabled></el-input>

                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="游隙" prop="clearance">
                          <el-input v-model="dataForm.clearance" placeholder="游隙" disabled></el-input>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="包装方式" prop="packagingMethod">
                          <el-input v-model="dataForm.packagingMethod" placeholder="包装方式" disabled></el-input>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item :label="$store.getters.specialRequire"  prop="specialRequire">
                          <el-input v-model="dataForm.specialRequire" placeholder="特殊要求" disabled></el-input>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="生产计划单号" prop="productionPlanNo">
                          <el-input v-model="dataForm.productionPlanNo" disabled />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="状态" prop="orderStatus">
                          <el-select v-model="dataForm.orderStatus" placeholder="精度等级" clearable style="width: 100%;"
                            disabled>
                            <el-option v-for="(item, index) in orderStatusList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="计划开始日期" prop="planStartDate">
                          <el-date-picker v-model="dataForm.planStartDate" placeholder="计划开始日期" type="date" disabled
                            value-format="yyyy-MM-dd" style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="8" :xs="24">
                        <el-form-item label="计划结束日期" prop="planEndDate">
                          <el-date-picker v-model="dataForm.planEndDate" placeholder="计划结束日期" type="date" disabled
                            value-format="yyyy-MM-dd" style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="是否紧急" prop="urgentFlag">
                          <el-select v-model="dataForm.urgentFlag" placeholder="精度等级" clearable style="width: 100%;"
                            disabled>
                            <el-option v-for="(item, index) in urgentFlagList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="创建时间" prop="createTime">
                          <el-date-picker v-model="dataForm.createTime" placeholder="创建时间" type="datetime" disabled
                            value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="创建人" prop="createByName">
                          <el-input v-model="dataForm.createByName" placeholder="创建人" disabled>
                          </el-input>
                        </el-form-item>
                      </el-col>


                    </el-row>
                  </el-form>
                </el-collapse-item>

              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="工单信息" name="workOrderInfo" v-if="btnType == 'all' || btnType == 'work'">
              <el-collapse v-model="activeNames2">
                <el-collapse-item title="工单信息" name="workOrderInfoForm" class="workOrderInfoForm">
                  <JNPF-table ref="work" :data="workOrderData" fixedNO v-loading="tableloading" class="data-form">
                    <el-table-column prop="processName" label="工序名称" min-width="120" />
                    <el-table-column prop="processCode" label="工序编码" min-width="120"></el-table-column>
                    <el-table-column prop="processingType" label="加工类型" min-width="120">
                      <template slot-scope="scope">
                        <div>
                          {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column prop="planStartDate" label="计划开始日期" min-width="150"></el-table-column>
                    <el-table-column prop="planEndDate" label="计划结束日期" min-width="150"></el-table-column>
                    <el-table-column prop="mainUnit" label="单位" min-width="80"></el-table-column>
                    <el-table-column prop="productionQuantity" label="生产数量" min-width="100"></el-table-column>
                    <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="100"></el-table-column>
                    <el-table-column prop="unqualifiedQuantity" label="不合格数量" min-width="130"></el-table-column>
                    <el-table-column prop="personId" label="人员" min-width="150">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.personId" placeholder="" clearable
                          style="width: 60%; display: none" class="applySelect" disabled>
                          <el-option
                            v-for="(item, index) in scope.row.workOrderResMap ? scope.row.workOrderResMap.personnel : []"
                            :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                        </el-select>
                        <el-button @click="selectPersonnelFun(scope)" type="text" class="underline-button"
                          :disabled="scope.row.processingType != 'self_produced'">
                          {{ scope.row.personId ? scope.row.personName : "请选择人员" }}
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column prop="workGroupId" label="班组" min-width="150">
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.workGroupId" placeholder="" class="applySelect" disabled
                          style="width: 70%; display: none">
                          <el-option
                            v-for="(item, index) in scope.row.workOrderResMap ? scope.row.workOrderResMap.work_group : []"
                            :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                        </el-select>
                        <el-button @click="selectWorkgroupFun(scope)" type="text" class="underline-button"
                          :disabled="scope.row.processingType != 'self_produced'">
                          {{ scope.row.workGroupId ? scope.row.workGroupName : "请选择班组" }}
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column prop="equipmentId" label="设备" min-width="150">

                      <template slot-scope="scope">
                        <el-select v-model="scope.row.equipmentId" placeholder="请选择设备" clearable
                          style="width:70%;display:none" class="applySelect" disabled>
                          <el-option
                            v-for="(item, index) in scope.row.workOrderResMap ? scope.row.workOrderResMap.device : []"
                            :key="index" :label="item.resourceName + '(' + item.resourceCode + ')'"
                            :value="item.resourceId"></el-option>
                        </el-select>
                        <el-button @click="selectDeviceFun(scope)" type="text" class="underline-button"
                          :disabled="scope.row.processingType != 'self_produced'">
                          {{ scope.row.equipmentId ? scope.row.equipmentCode ?
                            scope.row.equipmentName + "(" + scope.row.equipmentCode + ")" : scope.row.equipmentName :
                          "请选择设备" }}

                        </el-button>
                      </template>
                    </el-table-column>

                    <el-table-column prop="pickingFlag" label="是否领料" min-width="100">
                      <template slot-scope="scope">
                        <div>{{ scope.row.pickingFlag ? "是" : "否" }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="firstInspection" label="是否首检" min-width="100">
                      <template slot-scope="scope">
                        <div>{{ scope.row.firstInspection ? "是" : "否" }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="checkFlag" label="是否检验" min-width="100">
                      <template slot-scope="scope">
                        <div>{{ scope.row.checkFlag ? "是" : "否" }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="reportFlag" label="是否报工" min-width="100">
                      <template slot-scope="scope">
                        <div>{{ scope.row.reportFlag ? "是" : "否" }}</div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="stockFlag" label="是否入库" min-width="100">
                      <template slot-scope="scope">
                        <div>{{ scope.row.stockFlag ? "是" : "否" }}</div>
                      </template>
                    </el-table-column>






                  </JNPF-table>

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>

            <el-tab-pane label="投料信息" name="feedInfo" v-if="btnType == 'all' || btnType == 'feed'">
              <el-collapse v-model="activeNames3">
                <el-collapse-item title="投料信息" name="feedInfoForm" class="feedInfoForm">
                  <JNPF-table ref="feed" :data="feedData" fixedNo v-loading="tableloading" :key="Math.random()">
                    <el-table-column prop="productDrawingNo" label="用料规格"></el-table-column>
                    <el-table-column prop="productCode" label="用料编码" />
                    <el-table-column prop="processName" label="工序名称" />
                    <el-table-column prop="mainUnit" label="单位" />
                    <el-table-column prop="qty" label="单位用量" v-if="dataForm.orderType != 'rework'" />
                    <el-table-column prop="materialsUsedQuantity" label="计划用量" />
                    <el-table-column prop="receivedQuantity" label="已领数量" />
                    <el-table-column prop="inventoryQuantity" label="库存数量" />



                  </JNPF-table>

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="报工信息" name="reportRecords" v-if="btnType == 'report'">
              <el-collapse v-model="activeNames4">
                <el-collapse-item title="报工记录" name="record" class="feedInfoForm">
                  <JNPF-table ref="feed" :data="recoredsData" fixedNo v-loading="tableloading" :key="Math.random()">
                    <el-table-column prop="workNo" label="工单号" min-width="180"></el-table-column>
                    <el-table-column prop="orderNo" label="报工单号" min-width="180"></el-table-column>
                    <el-table-column prop="productDrawingNo" label="品名规格" min-width="180"></el-table-column>
                    <el-table-column prop="processName" label="工序名称" width="160" />
                    <el-table-column prop="reportingTime" label="报工时间" min-width="160" />
                    <el-table-column prop="producerName" label="生产人" min-width="160" />
                    <el-table-column prop="mainUnit" label="单位" min-width="160" />
                    <el-table-column prop="reportingQuantity" label="报工数量" min-width="160" />
                    <el-table-column prop="qualifiedQuantity" label="合格数量" min-width="160" />
                    <el-table-column prop="responsibilityWasteQuantity" label="责废数量" min-width="160" />
                    <el-table-column prop="materialWasteQuantity" label="料废数量" min-width="160" />
                    <el-table-column prop="reworkQuantity" label="返工数量" min-width="160" />
                    <el-table-column prop="vibrationLevel" label="振动等级" min-width="120" />
                    <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>



                  </JNPF-table>

                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
          </el-tabs>
        </div>
        <el-dialog :title="routingProResMapDiaTitle" :close-on-click-modal="false" :close-on-press-escape="false"
          append-to-body :visible.sync="routingProResMapDiaFlag" lock-scroll
          class="JNPF-dialog JNPF-dialog_center routingProRes" width="950px">
          <el-row class="row-bg" :gutter="0" style="margin: 12px 0" v-if="routingProResMapDiaTitle == '人员资源'">
            <el-col :span="4" class="personBox" :class="[item.split('_')[0] == currentPersonId ? 'active' : '']"
              v-for="(item, index) in personnelData" :key="index">
              <div class="grid-content bg-purple" @click="changresouce(item, '人员')"
                :style="!totalData[item].length ? 'height:100%' : ''" @dblclick="selectResouce(item, '人员')">
                <p style="margin-top: 14px; font-size: 16px">{{ item.split("_")[1] }}</p>
                <p style="font-size: 16px">
                  {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
                </p>
                <div v-if="totalData[item].length > 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") :''}}-
                    {{ totalData[item][0].planEndDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") :'' }}
                    {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                  </p>
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][1].planStartDate?totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") :""}}-
                    {{ totalData[item][1].planEndDate?totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", "."):"" }}
                    {{ totalData[item][1].completedQuantity }}/{{ totalData[item][1].dispatchQuantity }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      "."):'' }}-{{ totalData[item][0].planEndDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") :''}}
                    {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                  工单截止：{{ totalData[item][totalData[item].length - 1].planEndDate?totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                    .replace("-", "."):""
                  }}
                  <el-button class="elbutton" type="text" size="mini"
                    @click.stop="getDetailFun(item, totalData[item], '人员')"
                    :style="item.split('_')[0] == currentPersonId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="0" style="margin: 12px 0" v-if="routingProResMapDiaTitle == '班组资源'">
            <el-col :span="4" class="personBox" :class="[item.split('_')[0] == currentWorkgroupId ? 'active' : '']"
              v-for="(item, index) in workgroupData" :key="index">
              <div class="grid-content bg-purple" :style="!totalData[item].length ? 'height:100%' : ''"
                @click="changresouce(item, '班组')" @dblclick="selectResouce(item, '班组')">
                <p style="margin-top: 14px; font-size: 16px">{{ item.split("_")[1] }}</p>
                <p style="font-size: 16px">
                  {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
                </p>
                <div v-if="totalData[item].length > 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][totalData[item].length - 2].planStartDate?totalData[item][totalData[item].length - 2].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", "."):''
                    }}-
                    {{ totalData[item][totalData[item].length - 2].planEndDate?totalData[item][totalData[item].length - 2].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") :''}}
                    {{ totalData[item][totalData[item].length - 2].completedQuantity
                    }}/{{ totalData[item][totalData[item].length
                      - 2].dispatchQuantity }}个
                  </p>
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][totalData[item].length - 1].planStartDate?totalData[item][totalData[item].length - 1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") :""}}-
                    {{ totalData[item][totalData[item].length - 1].planEndDate?totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") :''}}
                    {{ totalData[item][totalData[item].length - 1].completedQuantity
                    }}/{{ totalData[item][totalData[item].length
                      - 1].dispatchQuantity }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") :''}}-{{ totalData[item][0].planEndDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".")  :''}}
                    {{ totalData[item][0].completedQuantity }}/{{ totalData[item][0].dispatchQuantity }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                  工单截止：{{ totalData[item][totalData[item].length - 1].planEndDate?totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") :''}}
                  <el-button class="elbutton" type="text" size="mini"
                    @click.stop="getDetailFun(item, totalData[item], '班组')"
                    :style="item.split('_')[0] == currentWorkgroupId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>
          </el-row>
          <el-row class="row-bg" :gutter="0" style="margin:12px 0;" v-if="routingProResMapDiaTitle == '设备资源'">
            <el-col :span="4" class="personBox" :class="[item.split('_')[0] == currentDeviceId ? 'active' : '']"
              v-for="(item, index) in deviceData" :key="index">
              <div class="grid-content bg-purple" @click="changresouce(item, '设备')"
                @dblclick="selectResouce(item, '设备')" :style="!totalData[item].length ? 'height:100%' : ''">
                <p style="margin-top:14px; font-size:18px">{{ item.split('_')[1] }}</p>
                <p style=" font-size:18px">{{ item.split('_')[2] ? item.split('_')[2] : '--' }}
                </p>
                <div v-if="totalData[item].length > 1">
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][0].planStartDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.'):'' }}-
                    {{ totalData[item][0].planEndDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') :'' }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity
                    }}个

                  </p>
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][1].planStartDate?totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') :''}}-
                    {{ totalData[item][1].planEndDate?totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') :''}}
                    {{ totalData[item][1].qualifiedQuantity }}/{{ totalData[item][1].productionQuantity
                    }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][0].planStartDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.'):''
                    }}-{{
                      totalData[item][0].planEndDate?totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') :'' }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity
                    }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top:4px; font-size:12px">工单截止：{{
                  totalData[item][totalData[item].length -  1].planEndDate?totalData[item][totalData[item].length -  1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.'):'' }} <el-button class="elbutton" type="text"
                    size="mini" @click.stop="getDetailFun(item, totalData[item], '设备')"
                    :style="item.split('_')[0] == currentDeviceId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>



          </el-row>
        </el-dialog>
        <el-dialog title="工单数据" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body
          :visible.sync="detailDiaFlag" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="1180px"
          @close="detailDiaFlag = false">
          <el-row class="JNPF-common-search-box" :gutter="5">
            <el-form @submit.native.prevent>
              <el-col :span="5">
                <el-form-item>
                  <el-input v-model="dispatchSearchForm.orderNo" @keyup.enter.native="dataFormSubmit()"
                    placeholder="工单号" clearable />
                </el-form-item>
              </el-col>

              <el-col :span="4">
                <el-form-item>
                  <el-input @keyup.native.enter="dataFormSubmit()"  v-model="dispatchSearchForm.processName" placeholder="工序名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-date-picker v-model="daterangeList" type="daterange" value-format="yyyy-MM-dd" style="width: 100%"
                    clearable start-placeholder="创建开始日期" end-placeholder="创建结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="5">
                <el-form-item>
                  <el-button type="primary" size="mini" icon="el-icon-search" @click="dataFormSubmit()">
                    {{ $t("common.search") }}</el-button>
                  <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{
                    $t("common.reset") }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <el-table ref="product" :data="detailDataList" border max-height="380">
            <el-table-column type="index" width="70" label="序号" fixed />
            <el-table-column prop="orderNo" label="工单号" min-width="200"></el-table-column>
            <el-table-column prop="productDrawingNo" label="品名规格" min-width="300"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="processName" label="工序名称" width="100" show-overflow-tooltip />
            <el-table-column prop="processCode" label="工序编码" width="100" />
            <el-table-column prop="planStartDate" label="计划开始日期" width="140" />
            <el-table-column prop="planEndDate" label="计划结束日期" width="140" />
            <el-table-column prop="productionQuantity" label="生产数量" width="100" />
            <el-table-column prop="qualifiedQuantity" label="合格数量" width="100" />
            <el-table-column prop="unqualifiedQuantity" label="不合格数量" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="120">
              <template slot-scope="scope">
                <div>{{ scope.row.createTime ? scope.row.createTime.substring(0, 10) : '' }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 40px; line-height: 40px; background: #f5f7fa;padding-left: 10px" class="text">
            <span style="font-weight:500;margin-right:10px">总生产数量：{{ totalProductionQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">合格数量：{{ totalQualifiedQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">不合格数量：{{ totalUnqualifiedQuantity }}</span>
          </div>
        </el-dialog>

      </div>
    </transition>
  </div>
</template>

<script>

import { detailordershengchan, changProdWork } from '@/api/productOrdes/index.js'
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange } from '@/api/basicData/processSettingss.js'
import { getWorkReportList } from "@/api/productOrdes/index.js"
export default {

  data() {
    return {
      detailDiaFlag: false,
      routingProResMapDiaFlag: false,
      dispatchSearchForm: {
        resIdList: [],
        resType: "",
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
      totalDispatchQuantity: 0,
      totalCompletedQuantity: 0,
      orderTypeList: [
        { label: "正常任务", value: "normal", },
        { label: "返工任务", value: "rework", },
      ],
      orderStatusList: [
        { label: "进行中", value: "normal", },
        { label: "暂停", value: "suspend", },
        { label: "关闭", value: "closed", },
        { label: "已完成", value: "finish", },
      ],
      urgentFlagList: [
        { label: "是", value: true, },
        { label: "否", value: false, },
      ],
      recoredsData: [],
      activeNames1: ["basicInfo"],
      activeNames2: ["workOrderInfoForm"],
      activeNames3: ["feedInfoForm"],
      activeNames4: ['record'],
      activeName: 'workOrderInfo',
      feedData: [],
      workOrderData: [],
      dataForm: {},
      formLoading: false,
      btnType: "",
      title: "",
      detailDataList: [],
      routingProResMapDiaTitle: "",
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      totalData: [],
      workOrderList: false,
      currentWorkgroupId: "",
      currentDeviceId: "",
      currentPersonId: '',
      btnLoading: false,
    }
  },
  computed: {
    totalProductionQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].productionQuantity])
      }
      return totalNums
    },
    totalQualifiedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].qualifiedQuantity])
      }
      return totalNums
    },
    totalUnqualifiedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math('add', [totalNums, this.detailDataList[i].unqualifiedQuantity])
      }
      return totalNums
    },
  },
  mounted() {

  },
  methods: {
    // 通过查询条件查询未完成的派工单
    dataFormSubmit() {
      if (this.daterangeList.length) {
        this.dispatchSearchForm.startTime = this.daterangeList[0] + " 00:00:00";
        this.dispatchSearchForm.endTime = this.daterangeList[1] + " 23:59:59";
      } else {
        this.dispatchSearchForm.startTime = "";
        this.dispatchSearchForm.endTime = "";
      }
      getWorkListMap(this.dispatchSearchForm).then((res) => {
        console.log("查询结果", res);
        let arr = Object.keys(res.data);
        console.log(555, res.data[arr[0]]);
        this.detailDataList = res.data[arr[0]];
      });
    },
    // 重置查询条件
    reset() {
      this.daterangeList = [];
      this.dispatchSearchForm = {
        resIdList: this.dispatchSearchForm.resIdList,
        resType: this.dispatchSearchForm.resType,
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
        this.dataFormSubmit();
    },
    // 点击详情
    getDetailFun(id, data, type) {
      console.log(data);
      this.dispatchSearchForm.resIdList = [];
      this.dispatchSearchForm.resIdList.push(id.split("_")[0]);
      // this.detailDataList = data
      this.detailDiaFlag = true;
      if (type == "人员") this.dispatchSearchForm.resType = "personnel";
      if (type == "设备") this.dispatchSearchForm.resType = "device";
      if (type == "班组") this.dispatchSearchForm.resType = "work_group";
      this.detailDiaFlag = true;
      this.dispatchSearchForm.startTime = "";
      this.dispatchSearchForm.endTime = "";
      this.daterangeList = [];
      this.dataFormSubmit();
    },
    handleClick() {

    },
    goBack() {
      this.$emit('close')
    },
    changresouce(item, type) {
      console.log("单击item", item);
      if (type == "人员") {
        this.currentPersonId = item.split("_")[0];
      }
      if (type == "班组") {
        this.currentWorkgroupId = item.split("_")[0];
      }
      if (type == "设备") {
        this.currentDeviceId = item.split("_")[0];
      }
    },
    // 选择班组
    selectWorkgroupFun(scope) {
      console.log("班组", scope);
      this.totalData = []
      if (scope.row.workOrderResMap) {
        if (scope.row.workOrderResMap.work_group) {
          this.index = scope.$index;
          this.currentWorkgroupId = scope.row.workGroupId;
          let workgroupData = scope.row.workOrderResMap.work_group;
          this.routingProResMapDiaFlag = true;
          this.routingProResMapDiaTitle = "班组资源";
          let resIdList = [];
          workgroupData.forEach((item) => {
            resIdList.push(item.resourceId);
          });
          let obj = {
            resType: "work_group",
            resIdList: resIdList,
          };
          getWorkListMap(obj).then((res) => {
            console.log("班组数据", res);
            this.workgroupData = Object.keys(res.data).sort();
            this.totalData = res.data;
            console.log(this.workgroupData);
            console.log(this.totalData);
          });
        } else {
          this.$message.error("当前工序没有配置班组资源");
        }
      } else {
        this.$message.error("当前工序没有配置班组资源");
      }
    },
    // 选择设备
    selectDeviceFun(scope) {
      console.log("设备", scope);
      this.totalData = []
      if (scope.row.workOrderResMap) {
        if (scope.row.workOrderResMap.device) {
          this.index = scope.$index
          this.currentDeviceId = scope.row.equipmentId
          let deviceDataData = scope.row.workOrderResMap.device
          this.routingProResMapDiaFlag = true
          this.routingProResMapDiaTitle = "设备资源"
          let resIdList = []
          deviceDataData.forEach(item => {
            resIdList.push(item.resourceId)
          });
          let obj = {
            resType: "device",
            resIdList: resIdList,
          }
          getWorkListMap(obj).then(res => {
            console.log("设备数据", res);
            this.deviceData = Object.keys(res.data).sort();
            this.totalData = res.data
          })
        } else {
          this.$message.error("当前工序没有配置设备资源")

        }
      } else {
        this.$message.error("当前工序没有配置设备资源")
      }
    },
    //  选择人员
    selectPersonnelFun(scope) {
      console.log(scope.row);

      this.totalData = []
      if (scope.row.workOrderResMap) {
        if (scope.row.workOrderResMap.personnel) {
          this.currentPersonId = scope.row.personId;
          this.index = scope.$index;
          let personnelData = scope.row.workOrderResMap.personnel;
          this.routingProResMapDiaFlag = true;
          this.routingProResMapDiaTitle = "人员资源";
          let resIdList = [];
          personnelData.forEach((item) => {
            resIdList.push(item.resourceId);
          });
          let obj = {
            resType: "personnel",
            resIdList: resIdList,
          };
          getWorkListMap(obj).then((res) => {
            console.log("人员数据", res);

            this.personnelData = Object.keys(res.data).sort();
            this.totalData = res.data;
          });
        } else {
          this.$message.error("当前工序没有配置人员资源");
        }
      } else {
        this.$message.error("当前工序没有配置人员资源");
      }
    },
    selectResouce(item, type) {
      console.log("双击item", item);
      if (type == "人员") {
        this.workOrderData[this.index].personId = item.split("_")[0];
        this.workOrderData[this.index].workOrderResMap.personnel.forEach((item) => {
          if (item.resourceId == this.workOrderData[this.index].personId) {
            this.workOrderData[this.index].personName = item.resourceName;
          }
        });
      }
      if (type == "班组") {
        this.workOrderData[this.index].workGroupId = item.split("_")[0];
        this.workOrderData[this.index].workOrderResMap.work_group.forEach((item) => {
          if (item.resourceId == this.workOrderData[this.index].workGroupId) {
            this.workOrderData[this.index].workGroupName = item.resourceName;
          }
        });
      }

      console.log("'this.workOrderData'", this.workOrderData);
      this.$forceUpdate();
      this.routingProResMapDiaFlag = false;
    },
    init(id, btnType) {
      this.btnType = btnType
      console.log(btnType);
      this.title = '改派'

      if (btnType != 'report') {

        detailordershengchan(id).then(res => {
          console.log("生产任务详情", res);
          this.dataForm = res.data.prodOrder
          this.feedData = res.data.materialList
          this.workOrderData = res.data.workOrderList
        })
      } else {
        let obj = {
          productionOrderNo: id,
          classAttribute: "finish_product",
          processId: "",
          reportingType:'normal',  // 报工类型 正常报工
          "orderItems": [
            {
              "asc": false,
              "column": ""
            },
            {
              "asc": false,
              "column": "create_time"
            }
          ],
          pageNum: -1,
          pageSize: 20,
        }
        getWorkReportList(obj).then(res => {
          this.recoredsData = res.data.records
        })
      }
    },
    handleConfirm() {
      console.log(this.workOrderData);
      this.workOrderData.forEach(item => {
        this.$set(item, 'productionOrderId', this.dataForm.id)
      });
      this.btnLoading = true
      changProdWork(this.workOrderData).then(res => {
        this.$message.success("改派成功")
        setTimeout(() => {
          this.$emit('close')
          this.btnLoading = false
        }, 1000);
      }).catch(error => {
        this.btnLoading = false

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

::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 10px !important;
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

.JNPF-preview-main .main {
  padding-top: 0;
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

::v-deep.el-collapse-item {
  margin-top: 5px;
}
.data-form ::v-deep.el-table__body-wrapper{
  height: auto!important;
}
</style>