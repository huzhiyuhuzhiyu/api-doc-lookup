<template>
  <div>
    <transition name="el-zoom-in-center">
      <div class="JNPF-preview-main org-form">
        <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
          <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
          <el-page-header @back="goBack" content="新建返工任务" />
          <div class="options">
            <el-button type="success" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('draft')">
              保存草稿</el-button>
            <el-button type="primary" v-if="btnType != 'look'" size="mini" :loading="btnLoading"
              @click="handleConfirm('submit')">
              保存并提交</el-button>
            <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
          </div>
        </div>
        <div class="main" v-loading="formLoading">
          <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
            <el-tab-pane label="基础信息" name="orderInfo">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">

                  <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="生产任务单号" prop="orderNo">
                          <el-input v-model="dataForm.orderNo"
                            :disabled="btnType == 'look' ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="返工产品" prop="drawingNo">
                          <el-input v-model="dataForm.drawingNo" placeholder="返工产品"
                            @focus="openSelectProductFun"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24" v-if="isProjectSwitch == 1">
                        <el-form-item label="所属项目" prop="projectName">
                          <el-input v-model="dataForm.projectName" placeholder="所属项目" disabled></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="工艺路线名称" prop="routingName">
                          <el-input v-model="dataForm.routingName" placeholder="工艺路线名称" readonly
                            @focus="openRoutingFun"></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="计划生产开始—结束日期" prop="planDate" style="margin-bottom: 20px;">
                          <el-date-picker v-model="dataForm.planDate" type="daterange" value-format="yyyy-MM-dd"
                            style="width: 100%;" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="返工生产数量" prop="productionQuantity">
                          <el-input v-model="dataForm.productionQuantity" placeholder="返工生产数量">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="编排任务方式" prop="taskMethod">
                          <el-select v-model="dataForm.taskMethod" placeholder="请选择业务类型" style="width: 100%;"
                            @change="selectTaskMethod">
                            <el-option v-for="(item, index) in taskMethodList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="打字内容" prop="sealingCoverTyping">
                          <el-select v-model="dataForm.sealingCoverTyping" placeholder="打字内容" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list1" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="精度等级" prop="accuracyLevel">
                          <el-select v-model="dataForm.accuracyLevel" placeholder="精度等级" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list2" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="振动等级" prop="vibrationLevel">
                          <el-select v-model="dataForm.vibrationLevel" placeholder="振动等级" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list3" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="油脂" prop="oil">
                          <el-select v-model="dataForm.oil" placeholder="油脂" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list4" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="油脂量" prop="oilQuantity">
                          <el-select v-model="dataForm.oilQuantity" placeholder="油脂量" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list5" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :sm="6" :xs="24">
                        <el-form-item label="游隙" prop="clearance">
                          <el-select v-model="dataForm.clearance" placeholder="游隙" clearable style="width: 100%;">
                            <el-option v-for="(item, index) in list6" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="包装方式" prop="packagingMethod">
                          <el-select v-model="dataForm.packagingMethod" placeholder="包装方式" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list7" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="特殊要求" prop="specialRequire">
                          <el-select v-model="dataForm.specialRequire" placeholder="特殊要求" clearable
                            style="width: 100%;">
                            <el-option v-for="(item, index) in list8" :key="index" :label="item.name"
                              :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="dataForm.remark" placeholder="请输入备注" type="textarea" maxlength="200"
                            :rows="2" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="工序信息" name="productInfo" style="border-bottom: 1px solid #dcdfe6 !important;">
                  <div>
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openselectProcessFun()">选择工序</el-button>|
                    <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDeleteProcess">批量删除</el-button>|
                  </div>
                  <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="processRef" class="data-form">
                    <JNPF-table ref="product" :data="dataFormTwo.data" fixedNO v-loading="tableloading" hasC
                      @selection-change="delProcessFun">
                      <el-table-column prop="processName" label="工序名称" min-width="170" />
                      <el-table-column prop="processCode" label="工序编码" width="130"></el-table-column>
                      <el-table-column prop="processingType" label="加工类型" width="100">
                        <template slot-scope="scope">
                          <div>
                            {{ scope.row.processingType == "self_produced" ? "自制" : "外协" }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="personId" label="人员" min-width="150"
                        v-if="dataForm.taskMethod != 'not_appoint'">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.personId" placeholder="" clearable
                            style="width: 60%; display: none" class="applySelect" disabled>
                            <el-option
                              v-for="(item, index) in scope.row.routingProResMap ? scope.row.routingProResMap.personnel : []"
                              :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                          </el-select>
                          <el-button @click="selectPersonnelFun(scope)" type="text" class="underline-button"
                            :disabled="scope.row.processingType != 'self_produced'">
                            {{ scope.row.personId ? scope.row.personName : "请选择人员" }}
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column prop="workGroupId" label="班组" min-width="150"
                        v-if="dataForm.taskMethod != 'not_appoint'">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.workGroupId" placeholder="" class="applySelect" disabled
                            style="width: 70%; display: none">
                            <el-option workGroupId
                              v-for="(item, index) in scope.row.routingProResMap ? scope.row.routingProResMap.work_group : []"
                              :key="index" :label="item.resourceName" :value="item.resourceId"></el-option>
                          </el-select>
                          <el-button @click="selectWorkgroupFun(scope)" type="text" class="underline-button"
                            :disabled="scope.row.processingType != 'self_produced'">
                            {{ scope.row.workGroupId ? scope.row.workGroupName : "请选择班组" }}
                          </el-button>
                        </template>
                      </el-table-column>
                      <el-table-column prop="equipmentId" label="设备" min-width="150"
                        v-if="dataForm.taskMethod != 'not_appoint'">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.equipmentId" placeholder="请选择设备" clearable
                            style="width:70%;display:none" class="applySelect" disabled>
                            <el-option
                              v-for="(item, index) in scope.row.routingProResMap ? scope.row.routingProResMap.device : []"
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

                      <!-- <el-table-column prop="productionLineId" label="产线" min-width="160">

                        <template slot-scope="scope">
                          <el-select v-model="scope.row.productionLineId" placeholder="请选择产线" clearable
                            :disabled="scope.row.processingType != 'self_produced'">
                            <el-option v-for="(item, index) in lineList" :key="index" :label="item.name"
                              :value="item.id"></el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="workstationId" label="工位" min-width="160">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.workstationId" placeholder="请选择工位"
                            :disabled="!scope.row.productionLineId" clearable @focus="selectworkstation(scope.row)">
                            <el-option v-for="(item, index) in workstationList" :key="index"
                              :label="item.workstationIdName" :value="item.workstationId"></el-option>
                          </el-select>
                        </template>
                      </el-table-column> -->
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
                      <el-table-column prop="workOrderFlag" label="是否生成工单" min-width="100">
                        <template slot-scope="scope">
                          <div>{{ scope.row.workOrderFlag ? "是" : "否" }}</div>
                        </template>
                      </el-table-column>
                    </JNPF-table>

                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="领料信息" name="annex">
              <el-collapse v-model="activeNames2" style="margin-top: 5px;">
                <el-collapse-item title="基本信息" name="pickbasicInfo" class="orderInfo" v-if="allocationFlag">
                  <el-form ref="collectForm" :model="collect" :rules="pickDataRule" label-width="160px"
                    label-position="top">
                    <el-row :gutter="30" class="custom-row">
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="领料单号" prop="orderNo">
                          <el-input v-model="collect.orderNo"
                            :disabled="btnType == 'look' ? true : collectConfig.codeWay == 'auto' && !collectConfig.modifyFlag ? true : false" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="8" :xs="24">
                        <el-form-item label="领料人" prop="personId">
                          <el-input v-model="collect.personId" :disabled="btnType == 'look' ? true : false"
                            placeholder="领料人" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="6" :xs="24">
                        <el-form-item label="领料日期" prop="operationDate">
                          <el-date-picker v-model="collect.operationDate" :default-value="new Date()" type="date"
                            value-format="yyyy-MM-dd" style="width: 100%;" placeholder="领料日期"
                            :disabled="btnType == 'look' ? true : false" @change="changDateFun">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>

                    </el-row>
                  </el-form>
                </el-collapse-item>
                <el-collapse-item title="领料清单" name="pickInfo">
                  <div>
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      icon="el-icon-plus" :disabled="btnType == 'look' ? true : false"
                      @click="openselectcollectProductFun()">选择产品</el-button>|
                    <!-- <el-button type="text" style="margin-right:8px;margin-left:8px font-size:14px!important" icon="el-icon-plus" @click="addProduct()">新增行</el-button>| -->
                    <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important"
                      :disabled="btnType == 'look' ? true : false" icon="el-icon-delete"
                      @click="batchDelete">批量删除</el-button>|
                  </div>
                  <el-form :model="dataFormOne" v-bind="dataFormOne" ref="processRef" class="data-form">

                    <el-table ref="product" :data="dataFormOne.collectData" fixedNo v-loading="tableloading"
                      v-bind="dataFormOne.collectData" @selection-change="handeleProductInfoData">
                      <el-table-column type="selection" width="55" fixed="left" :key="2"></el-table-column>
                      <el-table-column type="index" width="60" label="序号" align="center" fixed="left" />
                      <el-table-column prop="drawingNo" label="品名规格" />
                      <el-table-column prop="productCode" label="产品编码"></el-table-column>
                      <el-table-column prop="processName" label="工序名称">
                        <template slot="header">
                          <span class="required">*</span>工序名称
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'collectData.' + scope.$index + '.' + 'processName'"
                            :rules="productRules.processName">
                            <el-input v-model="scope.row.processName" readonly
                              @focus="selectCollectProcess(scope.$index)"></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="mainUnit" label="单位"></el-table-column>
                      <el-table-column prop="materialsUsedQuantity" label="投料数量">
                        <template slot="header">
                          <span class="required">*</span>投料数量
                        </template>
                        <template slot-scope="scope">
                          <el-form-item :prop="'collectData.' + scope.$index + '.' + 'materialsUsedQuantity'"
                            :rules="productRules.materialsUsedQuantity">
                            <el-input v-model="scope.row.materialsUsedQuantity" placeholder="投料数量" />
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="reduceType" label="扣减料方式">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.reduceType" placeholder="扣减料方式" style="width: 100%;">
                            <el-option v-for="(item, index) in reduceTypeList" :key="index" :label="item.label"
                              :value="item.value"></el-option>
                          </el-select>
                        </template>
                      </el-table-column> -->
                    </el-table>
                  </el-form>
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
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                    {{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity }}个
                  </p>
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}-
                    {{ totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][1].qualifiedQuantity }}/{{ totalData[item][1].productionQuantity }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}-{{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                  工单截止：{{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                    .replace("-", ".")
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
                    {{ totalData[item][totalData[item].length - 2].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                    }}-
                    {{ totalData[item][totalData[item].length - 2].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}
                    {{ totalData[item][totalData[item].length - 2].qualifiedQuantity
                    }}/{{ totalData[item][totalData[item].length
                      - 2].productionQuantity }}个
                  </p>
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][totalData[item].length - 1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}-
                    {{ totalData[item][totalData[item].length - 1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}
                    {{ totalData[item][totalData[item].length - 1].qualifiedQuantity
                    }}/{{ totalData[item][totalData[item].length
                      - 1].productionQuantity }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top: 4px; font-size: 12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}-{{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-", ".") }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top: 4px; font-size: 12px">
                  工单截止：{{ totalData[item][totalData[item].length -
                    1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace("-",
                      ".") }}
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
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') }}-
                    {{ totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity
                    }}个

                  </p>
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][1].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') }}-
                    {{ totalData[item][1].planEndDate.match(/-(\d{2}-\d{2})/)[1]
                      .replace('-', '.') }}
                    {{ totalData[item][1].qualifiedQuantity }}/{{ totalData[item][1].productionQuantity
                    }}个
                  </p>
                </div>
                <div v-else-if="totalData[item].length == 1">
                  <p style="margin-top:4px; font-size:12px">
                    {{ totalData[item][0].planStartDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.')
                    }}-{{
                      totalData[item][0].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') }}
                    {{ totalData[item][0].qualifiedQuantity }}/{{ totalData[item][0].productionQuantity
                    }}个
                  </p>
                </div>

                <p v-if="totalData[item].length" style="margin-top:4px; font-size:12px">工单截止：{{
                  totalData[item][totalData[item].length -
                    1].planEndDate.match(/-(\d{2}-\d{2})/)[1].replace('-', '.') }} <el-button class="elbutton" type="text"
                    size="mini" @click.stop="getDetailFun(item, totalData[item], '设备')"
                    :style="item.split('_')[0] == currentDeviceId ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;' : ''">详细</el-button>
                </p>
              </div>
            </el-col>



          </el-row>
        </el-dialog>
        <el-dialog title="工单信息" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body
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
                  <el-input v-model="dispatchSearchForm.processName" placeholder="工序名称" clearable />
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
            <el-table-column prop="processName" label="工序名称" width="100" />
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
          <div style="height: 40px; line-height: 40px; background: #f5f7fa;" class="text">
            <span style="font-weight:500;margin-right:10px">总生产数量：{{ totalProductionQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">合格数量：{{ totalQualifiedQuantity }}</span>
            <span style="font-weight:500;margin-right:10px">不合格数量：{{ totalUnqualifiedQuantity }}</span>
          </div>
        </el-dialog>






        <RoutingForm v-if="routingVisible" ref="routingForm" @selectRouting="selectRoutingFun"> </RoutingForm>
        <SelectProductForm v-if="productVisible" ref="productForm" @selectProduct="selectProductFun">
        </SelectProductForm>
        <SelectProcrssForm v-if="processVisible" ref="processForm" @selectProcess="selectProcessFun">
        </SelectProcrssForm>
        <CollectProductForm v-if="collectVisible" ref="collectProductForm"
          @selectCollectProduct="selectCollectProductFun">
        </CollectProductForm>
        <ComSelect-page ref="ComSelect-page" @change="submit" :tableItems="ProductTableItems" title="选择工序"
          treeTitle="工序分类" :methodArr="ProductMethodArr" :listMethod="getBimProcessList"
          :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false"
          :multiple="false" :listDataFormatting="listDataFormatting" />
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getprodOrderList,
  prodOrderInfo,
  addProdOrder,
  updateprodOrderFinished,
  prodOrderDispatch,
  dispatchListMap,
} from "@/api/productOrdes/finishedProductOrders";
import { excelExport, getProductionLineInfo, getProductionLineList } from "@/api/basicData/index";
import RoutingForm from "./RoutingForm.vue"
import SelectProductForm from './selectProductForm.vue'
import SelectProcrssForm from './processForm.vue'
import CollectProductForm from './CollectProductForm.vue'
import { getbimProductAttributesList } from '@/api/masterDataManagement/index'
import { detailProcess, getProcessList, getWorkListMap, addProdPlanArrange } from '@/api/basicData/processSettingss.js'
import { getBimBusinessSwitchConfigList } from '@/api/basicData/index'
import { getBimProcessList, getBimProcessDetail } from '@/api/bimProcess/index'
import { getcategoryTree } from '@/api/basicData/materialSettings'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    RoutingForm,
    SelectProductForm,
    SelectProcrssForm,
    CollectProductForm,
  },
  mixins: [getProjectList],

  data() {
    return {
      taskMethodList: [{ label: "指定加工对象", value: "appoint" }, { label: "不指定加工对象", value: "not_appoint" },],
      reduceTypeList: [
        { label: "生成领料单", value: "picking" },
        { label: "自动扣减料", value: "auto" },
        { label: "都不是", value: "none" },
      ],
      workOrderList: false,
      getBimProcessList,
      ProductMethodArr: [
        {
          label: '工序分类',
          classAttribute: 'process',
          method: getcategoryTree,
          requestObj: { classAttribute: 'process' }
        }
      ], // 产品选择弹出框树状列表
      ProductListRequestObj: {
        name: '',
        code: '',
        processingType: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20,
        productCategoryId: ''
      }, // 产品选择弹出框列表请求参数
      ProductTableItems: [
        { prop: 'code', label: '工序编码', fixed: 'left' },
        { prop: 'name', label: '工序名称', fixed: 'left' },
        { prop: 'name', label: '工序类型', fixed: 'left' },
        { prop: 'processTypeName', label: '加工类型', fixed: 'left' }
      ], // 产品选择弹出框表单展示字段
      ProductTableSearchList: [
        { prop: 'code', label: '工序编码', type: 'input' },
        { prop: 'name', label: '工序名称', type: 'input' }
      ],
      collectVisible: false,
      productRules: {
        materialsUsedQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ['', (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：投料数量${errMsg}`) }] }), trigger: ['blur'] },
          { validator: this.formValidate({ type: 'decimal', params: [20, 4, '', (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：投料数量${errMsg}`) }] }), trigger: ['blur'] },
          { validator: this.formValidate('positiveNumber', false, (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：投料数量${errMsg}`) }), trigger: 'blur' },
          { required: true, trigger: ['blur'] }
        ],
        processName: [{ validator: this.formValidate({ type: 'noEmtry', params: ['', (errMsg, index) => { this.$message.error(`领料清单第${index + 1}行：工序${errMsg}`) }] }), trigger: ['blur'] },]
      },
      collectConfig: {

      },
      pickDataRule: {
        orderNo: [
          { required: true, message: '领料单号单号不能为空', trigger: 'blur' }
        ],
        operationDate: [
          { required: true, message: '领料日期不能为空', trigger: 'change' }
        ],
       
      },
      activeNames2: [],
      collect: {
        orderNo: "",
        operationDate: "",
        personId: "",
      },
      allocationFlag: false,
      btnType: "",
      processVisible: false,
      productVisible: false,
      activeNames: ["productInfo", "basicInfo"],
      routingVisible: false,
      dataForm: {
        taskMethod: "appoint",
        planDate: [],
        orderNo: "",
        productsDrawingNo: "",
        productsCode: "",
        mainUnit: "",
        planProductionQuantity: "",
        availableArrangeQuantity: "",
        productionQuantity: "",
        planStartDate: "",
        planEndDate: "",
        routingName: "",
        routingId: "",
        sealingCoverTyping: "",
        accuracyLevel: "",
        vibrationLevel: "",
        oil: "",
        oilQuantity: "",
        clearance: "",
        packagingMethod: "",
        specialRequire: "",
        remark: "",
        bomId: "",
        drawingNo: "",
        productionLineId: "",
        projectName: "",
      },
      dataFormTwo: {
        data: [],
      },
      dataFormOne: {
        collectData: [],

      },
      listLoading: false,
      activeName: "orderInfo",
      isdisabled: false,
      visible: false,
      btnLoading: false,
      formLoading: false,
      dataRule: {
        orderNo: [
          { required: true, message: '生产任务单号不能为空', trigger: 'blur' }
        ],
        drawingNo: [
          { required: true, message: '返工产品不能为空', trigger: 'change' }
        ],
        planDate: [
          { required: true, message: '计划生产日期不能为空', trigger: 'change' }
        ],
        productionQuantity: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["返工生产数量不能为空", (errMsg) => { this.$message.error(`${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', false, (errMsg) => { this.$message.error(`返工生产数量${errMsg}`) }), trigger: 'blur' },
        ],
        routingName: [
          { required: true, message: '工艺路线不能为空', trigger: 'change' }
        ]
      },
      selectArr: [],
      list1: [],
      list2: [],
      list3: [],
      list4: [],
      list5: [],
      list6: [],
      list7: [],
      list8: [],
      totalData: [],
      index: "",
      currentWorkgroupId: "",
      currentDeviceId: "",
      currentPersonId: '',
      routingProResMapDiaFlag: false,
      routingProResMapDiaTitle: "",
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      workstationList: [],
      lineList: [],
      codeConfig: {},
      dispatchSearchForm: {
        resIdList: [],
        resType: "",
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
      detailDataList: [],
      selectProcessArr: [],
      selectRows: [],
      currentProductIndex: "",
      isSame: false,
      previousroutingId: "",
      detailDiaFlag: false,
      naturalResourcesFlag: true,
      isProjectSwitch: "",
    }
  },


  async created() {
    await this.getProjectSwitch('system', 'project')
    this.getPickingConfig()

  },
  computed: {
    ...mapGetters(['userInfo']),
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
    selectTaskMethod() {
      if (this.dataForm.taskMethod == 'not_appoint') {
        this.naturalResourcesFlag = false
      } else {
        this.naturalResourcesFlag = true
      }
    },
    handeleProductInfoData(val) {
      this.selectRows = val
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
        const index = this.dataFormOne.collectData.indexOf(row);
        if (index > -1) {
          this.dataFormOne.collectData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    listDataFormatting(res) {
      let treeData = res.data.records.map((item) => {
        if (item.processingType == 'self_produced') {
          item.processingTypeName = '自制'
        } else if (item.processingType == 'external_production') {
          item.processingTypeName = '外协'
        }

        if (item.processType == 'normal') {
          item.processTypeName = '正常工序'
        } else if (item.processType == 'wait_assemble') {
          item.processTypeName = '待装配工序'
        } else if (item.processType == 'vibrate') {
          item.processTypeName = '测震工序'
        }
        console.log("item", item)

        return item
      })
      return treeData
    },
    // 打开选择领料清单产品的工序弹框
    selectCollectProcess(index) {
      this.$refs['ComSelect-page'].openDialog()
      this.currentProductIndex = index
      console.log("currentProductIndex", this.currentProductIndex);
    },
    submit(id, data) {
      console.log("选择的工序", id, data, this.dataFormOne.collectData);
      let datas = data[0].all
      this.$set(this.dataFormOne.collectData[this.currentProductIndex], 'processName', datas.name)
      this.$set(this.dataFormOne.collectData[this.currentProductIndex], 'processId', datas.id)
    },

    // 打开选择领料清单选择产品弹框
    openselectcollectProductFun() {
      if (!this.dataForm.drawingNo) return this.$message.error("请先选择返工产品")
      this.collectVisible = true
      if (this.isProjectSwitch == 1) {
        this.$nextTick(() => {
          this.$refs.collectProductForm.init(this.dataForm.projectId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.collectProductForm.init("")
        })
      }

    },
    // 选择的领料清单产品
    selectCollectProductFun(data) {
      console.log("领料产品", data);
      data.forEach(item => {
        this.$set(item, 'reduceType', 'auto')
      });
      this.dataFormOne.collectData = data
    },
    //领料人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.collectForm.clearValidate('personId')
      })
      this.collect.personId = e
    },
    // 获取领料设置 领料是否自动生成领料单
    getPickingConfig() {

      let obj = { "pageSize": -1, "businessCode": "produce" }
      getBimBusinessSwitchConfigList(obj).then(res => {
        this.allocationFlag = res.data.produce[0].configValue1 == '1' ? true : false
        if (this.allocationFlag) {
          this.activeNames2 = ['pickInfo', 'pickbasicInfo']
        } else {
          this.activeNames2 = ['pickInfo']

        }
      })
    },
    // 打开选择工序的弹框
    openselectProcessFun() {
      if (!this.dataForm.routingId) return this.$message.error("请先选择工艺路线")
      this.processVisible = true
      this.$nextTick(() => {
        this.$refs.processForm.init(this.dataForm.routingId, this.dataFormTwo.data)
      })
    },
    // 选择工序
    selectProcessFun(data) {
      console.log("所选返工工序", data);
      this.dataFormTwo.data = data
    },
    delProcessFun(val) {
      this.selectProcessArr = val
    },
    // 批量删除工序
    batchDeleteProcess() {
      if (!this.selectProcessArr.length) return this.$message.error("请先选择您要删除的工序")
      let data = this.dataFormTwo.data
      for (let i = 0; i < this.selectProcessArr.length; i++) {
        const row = this.selectProcessArr[i];
        const index = data.indexOf(row);
        if (index > -1) {
          data.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      data[0].firstFlag = true;
      if (data.length == 1) {
        if (data[0].processingType !== "self_produced") {
          data[data.length - 1].stockFlag = false;
          data[data.length - 1].reportFlag = false;
        } else {
          data[data.length - 1].lastFlag = true;
          data[data.length - 1].stockFlag = true;
          data[data.length - 1].reportFlag = true;
        }
      } else {
        if (data[0].processingType !== "self_produced") {
          data[data.length - 1].stockFlag = false;
          data[data.length - 1].reportFlag = false;
        } else {
          data[data.length - 1].lastFlag = true;
          data[data.length - 1].stockFlag = true;
          data[data.length - 1].reportFlag = true;
        }
        if (data[data.length - 1].processingType !== "self_produced") {
          data[data.length - 1].stockFlag = false;
          data[data.length - 1].reportFlag = false;
        } else {
          data[data.length - 1].lastFlag = true;
          data[data.length - 1].stockFlag = true;
          data[data.length - 1].reportFlag = true;
        }
      }
    },
    // 打开选择返工产品弹框
    openSelectProductFun() {
      this.productVisible = true
      this.$nextTick(() => {
        if (this.isProjectSwitch == 1) {
          this.$refs.productForm.init(this.userInfo.projectId || '')

        } else {
          this.$refs.productForm.init('')

        }
      })
      console.log(6666);
    },
    // 选择返工产品
    selectProductFun(data) {
      console.log("所选返工产品", data);
      this.dataForm = data
      this.$set(this.dataForm, 'taskMethod', 'appoint')
      this.$set(this.dataForm, 'planDate', [])
      this.$set(this.dataForm, 'orderNo', this.codeConfig.number)
    },





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
    openRoutingFun() {
      if (!this.dataForm.drawingNo) return this.$message.error("请先选择返工产品")
      this.routingVisible = true
      this.$nextTick(() => {
        if (this.isProjectSwitch == 1) {
          this.$refs.routingForm.init(this.dataForm.projectId)

        } else {
          this.$refs.routingForm.init("")

        }
      })
    },
    selectRoutingFun(data) {
      console.log(data);
      this.dataForm.routingId = data.id
      this.dataForm.routingName = data.name
      this.isSame = this.dataForm.routingId === this.previousroutingId; // 判断是否相同  
      this.previousroutingId = this.dataForm.routingId; // 更新上一次选择
      if (!this.isSame) {
        console.log(666);
        this.dataFormTwo.data = []

      }

      detailProcess(data.id).then(res => {
        this.dataForm.reportRulesFlag = res.data.routing.reportRulesFlag
      })
    },
    // 选择班组
    selectWorkgroupFun(scope) {
      console.log("班组", scope);
      this.totalData = []
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.work_group) {
          this.index = scope.$index;
          this.currentWorkgroupId = scope.row.workGroupId;
          let workgroupData = scope.row.routingProResMap.work_group;
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
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.device) {
          this.index = scope.$index
          this.currentDeviceId = scope.row.equipmentId
          let deviceDataData = scope.row.routingProResMap.device
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
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.personnel) {
          this.currentPersonId = scope.row.personId;
          this.index = scope.$index;
          let personnelData = scope.row.routingProResMap.personnel;
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
        this.dataFormTwo.data[this.index].personId = item.split("_")[0];
        this.dataFormTwo.data[this.index].routingProResMap.personnel.forEach((item) => {
          if (item.resourceId == this.dataFormTwo.data[this.index].personId) {
            this.dataFormTwo.data[this.index].personName = item.resourceName;
          }
        });
      }
      if (type == "班组") {
        this.dataFormTwo.data[this.index].workGroupId = item.split("_")[0];
        this.dataFormTwo.data[this.index].routingProResMap.work_group.forEach((item) => {
          if (item.resourceId == this.dataFormTwo.data[this.index].workGroupId) {
            this.dataFormTwo.data[this.index].workGroupName = item.resourceName;
          }
        });
      }
      if (type == "设备") {
        this.dataFormTwo.data[this.index].equipmentId = item.split("_")[0];
        this.dataFormTwo.data[this.index].equipmentName = item.split("_")[1];
        this.dataFormTwo.data[this.index].equipmentCode = item.split("_")[2];

        // this.dataFormTwo.data[this.index].routingProResMap.device.forEach((item) => {
        //     if (item.resourceId == this.dataFormTwo.data[this.index].equipmentId) {
        //         this.dataFormTwo.data[this.index].equipmentName =
        //             item.resourceName + "(" + item.resourceCode + ")";
        //     }
        // });
      }
      console.log("'this.dataFormTwo.data'", this.dataFormTwo.data);

      this.routingProResMapDiaFlag = false;
    },
    // 选择工位
    selectworkstation(row) {
      console.log(row);
      this.workstationList = [];
      getProductionLineInfo(row.productionLineId).then((res) => {
        console.log("工位", res);
        this.workstationList = res.data.returnList;
        console.log(this.workstationList);

        this.$forceUpdate();
      });
    },
    // 获取打字内容(listP1)、精度等级(listP2)、振动等级(listP3)、油脂(listP4)、油脂量(listP5)、游隙(listP6)、包装方式(listP7)
    getProductClassFun() {

      let obj1 = {
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
        ],
      };
      getbimProductAttributesList(obj1).then(res => {
        this.list1 = res.data.records
      })
      let obj2 = {
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
        ],
      };
      getbimProductAttributesList(obj2).then(res => {
        this.list2 = res.data.records
      })
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
        ],
      };
      getbimProductAttributesList(obj3).then(res => {
        this.list3 = res.data.records
      })
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
        ],
      };
      getbimProductAttributesList(obj4).then(res => {
        this.list4 = res.data.records
      })
      let obj5 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa003",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj5).then(res => {
        this.list5 = res.data.records
      })
      let obj6 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa001",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };

      getbimProductAttributesList(obj6).then(res => {
        this.list6 = res.data.records
      })
      let obj7 = {
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
        ],
      };
      getbimProductAttributesList(obj7).then(res => {
        this.list7 = res.data.records
      })
      let obj8 = {
        pageNum: -1,
        pageSize: 20,
        typeCode: "pa016",
        orderItems: [
          {
            asc: false,
            column: "",
          },
          {
            asc: false,
            column: "code",
          },
        ],
      };
      getbimProductAttributesList(obj8).then(res => {
        this.list8 = res.data.records
      })



    },























    search() {
      this.form.pageNum = 1
      this.initData()
    },

    initData() {
      this.listLoading = true
      getCooperativeData(this.form).then(res => {
        this.tableDataCustomer = res.data.records
        this.total = res.data.total
        this.listLoading = false
        this.visible = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 产线
    getProductionLineListFun() {
      let objs = {
        code: "",
        createByName: "",
        endTime: "",
        name: "",
        orderItems: [
          {
            asc: true,
            column: "",
          },
        ],
        pageNum: 1,
        pageSize: -1,
      };
      // 获取产线
      objs.projectId = this.dataForm.projectId
      getProductionLineList(objs).then((res) => {
        console.log("产线", res);
        this.lineList = res.data.records;
      });
    },

    // 获取工艺详情
    getRoutingDetail(id) {
      detailProcess(id).then(res => {
        console.log("工艺详情", res);
        this.dataForm.reportRulesFlag = res.data.routing.reportRulesFlag
        this.dataFormTwo.data = res.data.routingLineList;
        res.data.routingLineList.forEach((item) => {

          if (item.routingProResMap) {
            if (item.routingProResMap.personnel) {
              this.$set(item, 'personId', item.routingProResMap.personnel[0].resourceId)
              this.$set(item, 'personName', item.routingProResMap.personnel[0].resourceName)
            }
            if (item.routingProResMap.work_group) {
              this.$set(item, 'workGroupId', item.routingProResMap.work_group[0].resourceId)
              this.$set(item, 'workGroupName', item.routingProResMap.work_group[0].resourceName)
            }
            if (item.routingProResMap.device) {

              this.$set(item, 'equipmentId', item.routingProResMap.device[0].resourceId)
              this.$set(item, 'equipmentName', item.routingProResMap.device[0].resourceName)

            }
          } else {
          }
        });
      })
    },
    async init(id, btnType) {
      console.log("传递数据", id, btnType);
      this.dataForm.id = id || ''
      this.btnType = btnType
      this.$set(this.dataForm, 'planDate', [])
      this.$refs.dataForm.clearValidate('planDate');
      this.getProductClassFun()
      await this.getProjectSwitch('system', 'project')
      this.getPickingConfig()
      if (btnType == 'edit') {
        this.fetchData("PROD", false)
        this.fetchData("PODH", false)
      }
      if (btnType == 'add') {

        this.fetchData("PROD", true)
        this.fetchData("PODH", true)
      }
      return
      this.dataForm = data[0]
      // let num=JSON.parse(JSON.stringify(this.dataForm.availableArrangeQuantity))
      // this.$set(this.dataForm,'productionQuantity',num)
      this.dataForm.productionQuantity = JSON.parse(JSON.stringify(this.dataForm.availableArrangeQuantity))
      this.$set(this.dataForm, 'productionPlanId', data[0].id)
      console.log(this.$refs.dataForm);
      this.getProductionLineListFun()
      this.getRoutingDetail(this.dataForm.routingId)
    },
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        if (code == 'PROD') {
          this.codeConfig = data
          if (flag) this.dataForm.orderNo = data.number

        }
        if (code == 'PODH') {
          this.collectConfig = data
          if (flag) this.collect.orderNo = data.number

        }

      } catch (error) {
      }
    },

    goBack() {
      this.$emit('close', true)
    },
    handleConfirm(value) {

      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.documentStatus = value
        if (valid) {
          this.dataForm.productsId = this.dataForm.id
          this.dataForm.planStartDate = this.dataForm.planDate[0]
          this.dataForm.planEndDate = this.dataForm.planDate[1]
          let submitFlag = null;
          if (!this.dataFormTwo.data.length) {
            this.$message.error("至少需要一道工序")
            submitFlag = false;
            return
          }

          if (this.allocationFlag) {
            this.dataForm.materialFlag = true
          } else {
            this.dataForm.materialFlag = false

          }
          if (this.naturalResourcesFlag) {

            for (let index = 0; index < this.dataFormTwo.data.length; index++) {
              const item = this.dataFormTwo.data[index];
              if (item.reportFlag) {

                if (
                  !item.workGroupId &&
                  !item.personId && item.processingType == "self_produced"
                ) {
                  submitFlag = false;
                  this.$message({
                    message: "第" + (index + 1) + "行班组、人员需要必填一项",
                    type: "error",
                  });
                  break;
                }
              } else {
                if (!item.personId && item.processingType == "self_produced") {
                  submitFlag = false;
                  this.$message({
                    message: "第" + (index + 1) + "行工序需配置人员信息",
                    type: "error",
                  });
                  break;
                }
              }
            }
          } else {
            this.dataFormTwo.data.forEach(item => {
              item.personId = ""
              item.equipmentId = ""
              item.workGroupId = ""
            });
          }

          this.dataFormTwo.data.forEach(item => {
            this.$set(item, 'productionQuantity', this.dataForm.productionQuantity)
            this.$set(item, 'planEndDate', this.dataForm.planEndDate)
            this.$set(item, 'planStartDate', this.dataForm.planStartDate)
          });

          if (submitFlag === false) return
          this.btnLoading = true;
          this.dataFormTwo.data.forEach(item => {
            item.routingProResList.forEach(items => {
              items.processId = item.processId
            })
            this.$set(item, 'workOrderResList', item.routingProResList)
          });
          let obj = {
            collect: this.dataFormTwo.data.length ? this.collect : null,
            materialList: this.dataFormOne.collectData,
            prodOrder: this.dataForm,
            workOrderList: this.dataFormTwo.data
          }
          console.log("dataForm", this.dataForm);
          console.log("dataFormTwo.data", this.dataFormTwo.data);
          console.log("coll", this.collect);
          console.log("dataFormOne.collectData", this.dataFormOne.collectData);

          addProdOrder(obj).then(res => {
            this.btnLoading = false
            this.$message.success("新建返工任务成功")
            setTimeout(() => {
              this.$emit('close')
            }, 1500);
          }).catch(error => {
            this.btnLoading = false

          })

        }
      })
    }
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

::v-deep .el-tabs__header {
  padding-left: 0 !important;
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
  padding: 0px;
  border-top: none !important;

}

.orderInfo ::v-deep.el-collapse-item__wrap {
  padding: 0 10px;
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
  margin-top: 5px;
  border-top: 0;
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

::v-deep .el-range-editor {
  height: 34px !important;
}
</style>