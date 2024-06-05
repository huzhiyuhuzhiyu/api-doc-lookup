<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" content="批量下料" />
        <div class="options" v-if="btnType != 'look'">
          <el-button
            type="primary"
            :loading="btnLoading"
            @click="handleConfirm('submit')"
          >
            提交下料</el-button
          >
          <el-button @click="goBack">{{ $t("common.cancelButton") }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <div
          style="
            line-height: 33px;
            font-size: 18px;
            border-bottom: 1px solid #dcdfe6;
            background: #fafafa;
            padding-left: 5px;
          "
        >
          <h5>基本信息</h5>
        </div>
        <el-form
          ref="dataForms"
          :model="blankingForm"
          :rules="dataRule"
          label-width="160px"
          label-position="top"
        >
          <el-row :gutter="30" class="custom-row">
            <el-col :sm="12" :xs="24">
              <el-form-item label="下料产品名称" prop="productName">
                <el-input
                  readonly
                  placeholder="请输入下料产品名称"
                  disabled
                  v-model="blankingForm.productName"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :sm="12" :xs="24">
              <el-form-item label="下料产品图号" prop="productDrawingNo">
                <el-input
                  placeholder="请输入下料产品图号"
                  disabled
                  v-model="blankingForm.productDrawingNo"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :sm="6" :xs="24">
              <el-form-item label="计划开始日期" prop="planStartDate">
                <el-date-picker
                  v-model="blankingForm.planStartDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  placeholder="计划开始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            
            <el-col :sm="6" :xs="24">
                            <el-form-item label="" style="margin-top:30px"  >
                                <div style="display:inline-block">
                                    <el-button type="primary" @click="previousDayS">前一天</el-button>
                                    <el-button type="primary" @click="nextDayS">后一天</el-button>
                                </div>
                            </el-form-item>
                       
                        </el-col>
                  
                   

            <el-col :sm="6" :xs="24">
              <el-form-item label="计划结束日期" prop="planEndDate">
                <el-date-picker
                  v-model="blankingForm.planEndDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  placeholder="计划结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :sm="6" :xs="24">
                            <el-form-item label="" style="margin-top:30px" >
                                <el-button type="primary" @click="previousDayE">前一天</el-button>
                                <el-button type="primary" @click="nextDayE">后一天</el-button>
                            </el-form-item>
                      
                        </el-col>
          </el-row>
        </el-form>
        <div
          style="
            line-height: 33px;
            font-size: 18px;
            border-bottom: 1px solid #dcdfe6;
            background: #fafafa;
            padding-left: 5px;
            margin-top: 20px;
          "
        >
          <h5>生产信息</h5>
        </div>
        <el-form :model="blankingForm" v-bind="blankingForm" ref="productForm">
          <JNPF-table
            ref="product"
            class="tableContainer"
            :data="blankingForm.blankingList"
            :fixedNO="false"
          >
            <el-table-column
              prop="productionOrderNo"
              label="生产订单号"
              min-width="200"
            ></el-table-column>
            <el-table-column
              prop="productCode"
              label="产品编码"
              min-width="130"
            />
            <el-table-column
              prop="productName"
              label="产品名称"
              min-width="130"
            />
            <el-table-column
              prop="productDrawingNo"
              label="产品图号"
              min-width="200"
            />
            <el-table-column
              prop="deliveryDate"
              label="交货日期"
              min-width="130"
            />
            <el-table-column prop="mainUnit" label="单位" min-width="130" />
            <el-table-column
              prop="workOrderQuantity"
              label="需生产数量"
              min-width="130"
            />
            <el-table-column
              prop="workOderCompletedQuantity"
              label="已完成数量"
              min-width="130"
            />
            <el-table-column
              prop="blankingQuantity"
              label="已派下料数量"
              min-width="130"
            ></el-table-column>
            <el-table-column
              prop="dispatchQuantity"
              label="派工数量"
              min-width="130"
              fixed="right"
            >
              <template slot="header">
                <span class="required">*</span>派工数量
              </template>
              <template slot-scope="scope">
                <el-form-item
                  :prop="
                    'blankingList.' + scope.$index + '.' + 'dispatchQuantity'
                  "
                  :rules="productRules.dispatchQuantity"
                >
                  <el-input
                    v-model="scope.row.dispatchQuantity"
                    maxlength="20"
                    placeholder="请输入派工数量"
                    >{{ scope.row.dispatchQuantity }}
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="workGroupId" label="班组" min-width="130" fixed="right">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.workGroupId" placeholder="请选择班组" clearable
                                    @clear="clearGroup(scope)">
                                    <el-option v-for="(item, index) in scope.row.routingProResMap.work_group" :key="index"
                                        :label="item.resourceName" :value="item.resourceId"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="equipmentId" label="设备" width="220" fixed="right">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.equipmentId" placeholder="请选择设备" clearable>
                                    <el-option v-for="(item, index) in scope.row.routingProResMap.device" :key="index"
                                        :label="item.resourceName + '(' + item.resourceCode + ')'"
                                        :value="item.resourceId"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column prop="personId" label="人员" width="160" fixed="right">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.personId" placeholder="请选择人员" clearable>
                                    <el-option v-for="(item, index) in scope.row.routingProResMap.personnel" :key="index"
                                        :label="item.resourceName" :value="item.resourceId"></el-option>
                                </el-select>
                            </template>
                        </el-table-column> -->

            <el-table-column
              prop="workGroupId"
              label="班组"
              min-width="130"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.workGroupId"
                  placeholder=""
                  class="applySelect"
                  disabled
                  style="width: 70%; display: none"
                  @clear="clearGroup(scope)"
                >
                  <el-option
                    v-for="(item, index) in scope.row.routingProResMap
                      ? scope.row.routingProResMap.work_group
                      : []"
                    :key="index"
                    :label="item.resourceName"
                    :value="item.resourceId"
                  ></el-option>
                </el-select>
                <el-button
                  @click="selectWorkgroupFun(scope)"
                  type="text"
                  class="underline-button"
                  :disabled="scope.row.processingType != 'self_produced'"
                  >{{
                    scope.row.workGroupId
                      ? scope.row.workGroupName
                      : "请选择班组"
                  }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="equipmentId"
              label="设备"
              width="220"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.equipmentId"
                  placeholder=""
                  clearable
                  class="applySelect"
                  style="width: 70%; display: none"
                  disabled
                >
                  <el-option
                    v-for="(item, index) in scope.row.routingProResMap
                      ? scope.row.routingProResMap.device
                      : []"
                    :key="index"
                    :label="item.resourceName + '(' + item.resourceCode + ')'"
                    :value="item.resourceId"
                  ></el-option>
                </el-select>
                <el-button
                  @click="selectDeviceFun(scope)"
                  type="text"
                  class="underline-button"
                  :disabled="scope.row.processingType != 'self_produced'"
                  >{{
                    scope.row.equipmentId
                      ? scope.row.equipmentName
                      : "请选择设备"
                  }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="personId"
              label="人员"
              width="160"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.personId"
                  placeholder=""
                  clearable
                  style="width: 60%; display: none"
                  class="applySelect"
                  disabled
                >
                  <el-option
                    v-for="(item, index) in scope.row.routingProResMap
                      ? scope.row.routingProResMap.personnel
                      : []"
                    :key="index"
                    :label="item.resourceName"
                    :value="item.resourceId"
                  ></el-option>
                </el-select>
                <el-button
                  @click="selectPersonnelFun(scope)"
                  type="text"
                  class="underline-button"
                  :disabled="scope.row.processingType != 'self_produced'"
                  >{{
                    scope.row.personId ? scope.row.personName : "请选择人员"
                  }}</el-button
                >
              </template>
            </el-table-column>

            <el-table-column prop="productionLineId" label="产线" width="160">
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.productCode" placeholder="请选择产线"  /> -->
                <el-select
                  v-model="scope.row.productionLineId"
                  placeholder="请选择产线"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in lineList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="workstationId" label="工位" width="160">
              <template slot-scope="scope">
                <!-- <el-input v-model="scope.row.productCode" placeholder="请选择工位" /> -->
                <el-select
                  v-model="scope.row.workstationId"
                  placeholder="请选择工位"
                  :disabled="!scope.row.productionLineId"
                  clearable
                  @focus="selectworkstation(scope.row)"
                >
                  <el-option
                    v-for="(item, index) in workstationList"
                    :key="index"
                    :label="item.workstationIdName"
                    :value="item.workstationId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="160">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              min-width="180"
              fixed="right"
              v-if="blankingForm.blankingList.length > 1"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleDel(scope)"
                  style="color: #ff3a3a"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </JNPF-table>
        </el-form>
      </div>
      <el-dialog
        :title="routingProResMapDiaTitle"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        :visible.sync="routingProResMapDiaFlag"
        lock-scroll
        class="JNPF-dialog JNPF-dialog_center routingProRes"
        width="950px"
      >
        <el-row
          class="row-bg"
          :gutter="0"
          style="margin: 12px 0"
          v-if="routingProResMapDiaTitle == '人员资源'"
        >
          <el-col
            :span="4"
            class="personBox"
            :class="[item.split('_')[0] == currentPersonId ? 'active' : '']"
            v-for="(item, index) in personnelData"
            :key="index"
          >
            <div
              class="grid-content bg-purple"
              @click="changresouce(item, '人员')"
              :style="!totalData[item].length ? 'height:100%' : ''"
              @dblclick="selectResouce(item, '人员')"
            >
              <p style="margin-top: 14px; font-size: 16px">
                {{ item.split("_")[1] }}
              </p>
              <p style="font-size: 16px">
                {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
              </p>
              <div v-if="totalData[item].length > 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][0].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-
                  {{
                    totalData[item][0].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][0].completedQuantity }}/{{
                    totalData[item][0].dispatchQuantity
                  }}个
                </p>
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][1].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-
                  {{
                    totalData[item][1].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][1].completedQuantity }}/{{
                    totalData[item][1].dispatchQuantity
                  }}个
                </p>
              </div>
              <div v-else-if="totalData[item].length == 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][0].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-{{
                    totalData[item][0].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][0].completedQuantity }}/{{
                    totalData[item][0].dispatchQuantity
                  }}个
                </p>
              </div>

              <p
                v-if="totalData[item].length"
                style="margin-top: 4px; font-size: 12px"
              >
                派工截止：{{
                  totalData[item][totalData[item].length - 1].planEndDate
                    .match(/-(\d{2}-\d{2})/)[1]
                    .replace("-", ".")
                }}
                <el-button
                  class="elbutton"
                  type="text"
                  size="mini"
                  @click.stop="getDetailFun(item, totalData[item], '人员')"
                  :style="
                    item.split('_')[0] == currentPersonId
                      ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;'
                      : ''
                  "
                  >详细</el-button
                >
              </p>
            </div>
          </el-col>
        </el-row>
        <el-row
          class="row-bg"
          :gutter="0"
          style="margin: 12px 0"
          v-if="routingProResMapDiaTitle == '班组资源'"
        >
          <el-col
            :span="4"
            class="personBox"
            :class="[item.split('_')[0] == currentWorkgroupId ? 'active' : '']"
            v-for="(item, index) in workgroupData"
            :key="index"
          >
            <div
              class="grid-content bg-purple"
              :style="!totalData[item].length ? 'height:100%' : ''"
              @click="changresouce(item, '班组')"
              @dblclick="selectResouce(item, '班组')"
            >
              <p style="margin-top: 14px; font-size: 16px">
                {{ item.split("_")[1] }}
              </p>
              <p style="font-size: 16px">
                {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
              </p>
              <div v-if="totalData[item].length > 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][totalData[item].length - 2].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-
                  {{
                    totalData[item][totalData[item].length - 2].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{
                    totalData[item][totalData[item].length - 2]
                      .completedQuantity
                  }}/{{
                    totalData[item][totalData[item].length - 2]
                      .dispatchQuantity
                  }}个
                </p>
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][totalData[item].length - 1].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-
                  {{
                    totalData[item][totalData[item].length - 1].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{
                    totalData[item][totalData[item].length - 1]
                      .completedQuantity
                  }}/{{
                    totalData[item][totalData[item].length - 1]
                      .dispatchQuantity
                  }}个
                </p>
              </div>
              <div v-else-if="totalData[item].length == 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][0].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-{{
                    totalData[item][0].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][0].completedQuantity }}/{{
                    totalData[item][0].dispatchQuantity
                  }}个
                </p>
              </div>

              <p
                v-if="totalData[item].length"
                style="margin-top: 4px; font-size: 12px"
              >
                派工截止：{{
                  totalData[item][totalData[item].length - 1].planEndDate
                    .match(/-(\d{2}-\d{2})/)[1]
                    .replace("-", ".")
                }}
                <el-button
                  class="elbutton"
                  type="text"
                  size="mini"
                  @click.stop="getDetailFun(item, totalData[item], '班组')"
                  :style="
                    item.split('_')[0] == currentWorkgroupId
                      ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;'
                      : ''
                  "
                  >详细</el-button
                >
              </p>
            </div>
          </el-col>
        </el-row>
        <el-row
          class="row-bg"
          :gutter="0"
          style="margin: 12px 0"
          v-if="routingProResMapDiaTitle == '设备资源'"
        >
          <el-col
            :span="4"
            class="personBox"
            :class="[item.split('_')[0] == currentDeviceId ? 'active' : '']"
            v-for="(item, index) in deviceData"
            :key="index"
          >
            <div
              class="grid-content bg-purple"
              @click="changresouce(item, '设备')"
              @dblclick="selectResouce(item, '设备')"
              :style="!totalData[item].length ? 'height:100%' : ''"
            >
              <p style="margin-top: 14px; font-size: 16px">
                {{ item.split("_")[1] }}
              </p>
              <p style="font-size: 16px">
                {{ item.split("_")[2] ? item.split("_")[2] : "--" }}
              </p>
              <div v-if="totalData[item].length > 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][0].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-
                  {{
                    totalData[item][0].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][0].completedQuantity }}/{{
                    totalData[item][0].dispatchQuantity
                  }}个
                </p>
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][1].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-
                  {{
                    totalData[item][1].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][1].completedQuantity }}/{{
                    totalData[item][1].dispatchQuantity
                  }}个
                </p>
              </div>
              <div v-else-if="totalData[item].length == 1">
                <p style="margin-top: 4px; font-size: 12px">
                  {{
                    totalData[item][0].planStartDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}-{{
                    totalData[item][0].planEndDate
                      .match(/-(\d{2}-\d{2})/)[1]
                      .replace("-", ".")
                  }}
                  {{ totalData[item][0].completedQuantity }}/{{
                    totalData[item][0].dispatchQuantity
                  }}个
                </p>
              </div>

              <p
                v-if="totalData[item].length"
                style="margin-top: 4px; font-size: 12px"
              >
                派工截止：{{
                  totalData[item][totalData[item].length - 1].planEndDate
                    .match(/-(\d{2}-\d{2})/)[1]
                    .replace("-", ".")
                }}
                <el-button
                  class="elbutton"
                  type="text"
                  size="mini"
                  @click.stop="getDetailFun(item, totalData[item], '设备')"
                  :style="
                    item.split('_')[0] == currentDeviceId
                      ? 'border:1px solid #fff;color:#1890ff;background:#fff;    padding: 4px!important;'
                      : ''
                  "
                  >详细</el-button
                >
              </p>
            </div>
          </el-col>
        </el-row>
      </el-dialog>
      <el-dialog
        title="派工单数据"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        :visible.sync="detailDiaFlag"
        lock-scroll
        class="JNPF-dialog JNPF-dialog_center"
        width="1180px"
      >
        <el-row class="JNPF-common-search-box" :gutter="16">
          <el-form @submit.native.prevent>
            <el-col :span="4">
              <el-form-item>
                <el-input
                  v-model="dispatchSearchForm.orderNo"
                  @keyup.enter.native="dataFormSubmit()"
                  placeholder="请输入派工单号"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :span="4">
              <el-form-item>
                <el-input
                  v-model="dispatchSearchForm.processName"
                  placeholder="请输入工序名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-date-picker
                  v-model="daterangeList"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  style="width: 100%"
                  clearable
                  start-placeholder="请选择创建开始日期"
                  end-placeholder="请选择创建结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="dataFormSubmit()"
                >
                  {{ $t("common.search") }}</el-button
                >
                <el-button
                  size="mini"
                  icon="el-icon-refresh-right"
                  @click="reset()"
                  >{{ $t("common.reset") }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <el-table ref="product" :data="detailDataList" max-height="600">
          <el-table-column type="index" width="70" label="序号" />
          <el-table-column
            prop="orderNo"
            label="派工单号"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="productCode"
            label="产品编码"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="productDrawingNo"
            label="产品图号"
            min-width="300"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="processCode" label="工序编码" width="100" />
          <el-table-column
            prop="processName"
            label="工序名称"
            min-width="100"
          />
          <el-table-column
            prop="planStartDate"
            label="计划开始日期"
            width="140"
          />
          <el-table-column
            prop="planEndDate"
            label="计划结束日期"
            width="140"
          />
          <el-table-column
            prop="dispatchQuantity"
            label="派工数量"
            width="100"
          />
          <el-table-column
            prop="completedQuantity"
            label="完工数量"
            width="100"
          />
          <el-table-column prop="createTime" label="创建时间" width="120">
            <template scope="scope">
              <div>
                {{
                  scope.row.createTime
                    ? scope.row.createTime.substring(0, 10)
                    : ""
                }}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div
          style="height: 40px; line-height: 40px; background: #f5f7fa"
          class="text"
        >
          <span style="font-weight: 500; margin-right: 10px"
            >总派工数量：{{ totalDispatchQuantity }}</span
          >
          <span style="font-weight: 500; margin-right: 10px"
            >总完工数量：{{ totalCompletedQuantity }}</span
          >
        </div>
      </el-dialog>
    </div>
  </transition>
</template>
  
<script>
import {
  getprodOrderList,
  prodOrderInfo,
  batchBlanking,
  getBlankingList,
  dispatchListMap,
} from "@/api/productOrdes/finishedProductOrders";
import {
  getProductionLineList,
  getProductionLineInfo,
} from "@/api/basicData/index";
import ExportForm from "@/components/no_mount/ExportBox/index";

export default {
  components: { ExportForm },
  data() {
    return {
      detailDiaFlag: false,
      detailDataList: [],

      routingProResMapDiaFlag: false,
      routingProResMapDiaTitle: "",

      lineList: [],
      workerList: [],
      orderQuantity: "", //原订单生产数量
      workOrderData: [],
      blankingForm: {
        productDrawingNo: "",
        productName: "",
        planStartDate: new Date(),
        planEndDate: new Date(),
        blankingList: [],
      },

      orderVisible: false,
      listLoading: false,
      total: 0,
      orderDetailData: [],
      orderData: [],
      btnType: undefined,
      activeName: "orderInfo",
      nodeId: -1,
      btnLoading: false,
      formLoading: false,
      parentId: "",
      dataRule: {
        planEndDate: [
          { required: true, message: "请选择计划结束日期", trigger: "change" },
        ],
        planStartDate: [
          { required: true, message: "请选择计划结束日期", trigger: "change" },
        ],
      },
      id: "",

      materialList: [],
      selectArr: [],
      prodOrderList: [],
      workstationList: [],
      productRules: {
        // warehouse: [{ required: true, trigger: ['change'] },],
        dispatchQuantity: [
          { required: true, trigger: ["blur"], message: "请输入派工数量" },
          {
            validator: this.formValidate({
              type: "decimal",
              params: [
                20,
                4,
                "",
                (errMsg, index) => {
                  this.$message.error(
                    "第" + (index + 1) + "行：派工数量" + errMsg
                  );
                },
              ],
            }),
            trigger: "blur",
          },
          {
            validator: this.formValidate("noZero", "", (errMsg, index) => {
              this.$message.error("第" + (index + 1) + "行：派工数量不能为0");
            }),
            trigger: "blur",
          },
          // { validator: this.maxLength(), trigger: ['blur'] }
        ],
      },
      workgroupData: [],
      deviceData: [],
      personnelData: [],
      totalData: [],
      currentPersonId: "",
      currentWorkgroupId: "",
      currentDeviceId: "",
      index: null,
      resourceId: [],
      dispatchSearchForm: {
        resIdList: [],
        resType: "",
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      },
      daterangeList: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.treeBox.filter(val);
    },
  },
  computed: {
    totalDispatchQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math("add", [
          totalNums,
          this.detailDataList[i].dispatchQuantity,
        ]);
      }
      return totalNums;
    },
    totalCompletedQuantity: function () {
      var totalNums = 0;
      for (var i = 0; i < this.detailDataList.length; i++) {
        totalNums = this.jnpf.math("add", [
          totalNums,
          this.detailDataList[i].completedQuantity,
        ]);
      }
      return totalNums;
    },
  },
  created() {},
  mounted() {},
  methods: {
          // 开始日期前一天
          previousDayS(){
            if(!this.blankingForm.planStartDate) return this.$message.error("请先选择日期")
            let date = new Date( this.blankingForm.planStartDate);
                    date.setDate(date.getDate() - 1);
                     this.blankingForm.planStartDate = date.toISOString().split('T')[0];
          
        },
        nextDayS(){
            if(!this.blankingForm.planStartDate) return this.$message.error("请先选择日期")
            let date = new Date( this.blankingForm.planStartDate);
                    date.setDate(date.getDate() + 1);
                     this.blankingForm.planStartDate = date.toISOString().split('T')[0];
            
        },
         // 结束日期前一天
         previousDayE(){
            if(!this.blankingForm.planEndDate) return this.$message.error("请先选择日期")
            let date = new Date( this.blankingForm.planEndDate);
                    date.setDate(date.getDate() - 1);
                     this.blankingForm.planEndDate = date.toISOString().split('T')[0];
          
        },
        nextDayE(){
            if(!this.blankingForm.planEndDate) return this.$message.error("请先选择日期")
            let date = new Date( this.blankingForm.planEndDate);
                    date.setDate(date.getDate() + 1);
                     this.blankingForm.planEndDate = date.toISOString().split('T')[0];
            
        },
    // 删除数据
    handleDel(row) {
      console.log(row);
      // if (row.$index != this.workerList.length - 1) {
      //     this.$confirm('删除当前工序时，会一起把后面的工序一起删除，您是否继续？', '提示', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         type: 'warning'
      //     }).then(() => {

      //     }).catch(() => {

      //     })
      // } else {
      //     this.workerList.splice(row.$index);
      // }
      this.blankingForm.blankingList.splice(row.$index,1);
    },
    selectResouce(item, type) {
      console.log("双击item", item);
      if (type == "人员") {
        this.blankingForm.blankingList[this.index].personId =
          item.split("_")[0];
        this.blankingForm.blankingList[
          this.index
        ].routingProResMap.personnel.forEach((item) => {
          if (
            item.resourceId ==
            this.blankingForm.blankingList[this.index].personId
          ) {
            this.blankingForm.blankingList[this.index].personName =
              item.resourceName;
          }
        });
      }
      if (type == "班组") {
        this.blankingForm.blankingList[this.index].workGroupId =
          item.split("_")[0];
        this.blankingForm.blankingList[
          this.index
        ].routingProResMap.work_group.forEach((item) => {
          if (
            item.resourceId ==
            this.blankingForm.blankingList[this.index].workGroupId
          ) {
            this.blankingForm.blankingList[this.index].workGroupName =
              item.resourceName;
          }
        });
      }
      if (type == "设备") {
        this.blankingForm.blankingList[this.index].equipmentId =
          item.split("_")[0];
        this.blankingForm.blankingList[
          this.index
        ].routingProResMap.device.forEach((item) => {
          if (
            item.resourceId ==
            this.blankingForm.blankingList[this.index].equipmentId
          ) {
            this.blankingForm.blankingList[this.index].equipmentName =
              item.resourceName + "(" + item.resourceCode + ")";
          }
        });
      }
      this.routingProResMapDiaFlag = false;
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
    // 通过查询条件查询未完成的派工单
    dataFormSubmit() {
      if (this.daterangeList.length) {
        this.dispatchSearchForm.startTime = this.daterangeList[0] + " 00:00:00";
        this.dispatchSearchForm.endTime = this.daterangeList[1] + " 23:59:59";
      } else {
        this.dispatchSearchForm.startTime = "";
        this.dispatchSearchForm.endTime = "";
      }
      dispatchListMap(this.dispatchSearchForm).then((res) => {
        console.log("查询结果", res);
        let arr = Object.keys(res.data);
        console.log(555, res.data[arr[0]]);
        this.detailDataList = res.data[arr[0]];
      });
    },
    // 重置查询条件
    reset() {
      this.daterangeList = [];
      (this.dispatchSearchForm = {
        resIdList: this.dispatchSearchForm.resIdList,
        resType: this.dispatchSearchForm.resType,
        endTime: "",
        startTime: "",
        orderNo: "",
        processName: "",
      }),
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
    // 选择班组
    selectWorkgroupFun(scope) {
      console.log("班组", scope);
      this.totalData = [];
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
          dispatchListMap(obj).then((res) => {
            console.log("班组数据", res);
            this.workgroupData = Object.keys(res.data).sort();
            this.totalData = res.data;
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
      this.totalData = [];
      if (scope.row.routingProResMap) {
        if (scope.row.routingProResMap.device) {
          this.index = scope.$index;
          this.currentDeviceId = scope.row.equipmentId;
          let deviceDataData = scope.row.routingProResMap.device;
          this.routingProResMapDiaFlag = true;
          this.routingProResMapDiaTitle = "设备资源";
          let resIdList = [];
          deviceDataData.forEach((item) => {
            resIdList.push(item.resourceId);
          });
          let obj = {
            resType: "device",
            resIdList: resIdList,
          };
          dispatchListMap(obj).then((res) => {
            console.log("设备数据", res);
            this.deviceData = Object.keys(res.data).sort();
            this.totalData = res.data;
          });
        } else {
          this.$message.error("当前工序没有配置设备资源");
        }
      } else {
        this.$message.error("当前工序没有配置设备资源");
      }
    },
    //  选择人员
    selectPersonnelFun(scope) {
      console.log(scope.row);

      this.totalData = [];
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
          dispatchListMap(obj).then((res) => {
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
    clearGroup(data) {
      console.log("班组", data);
    },
    clearPerson(data) {
      console.log("人员", data);
    },

    goBack() {
      this.$emit("close");
    },
    init(data) {
      console.log("批量下料", data);
      let idList = [];
      data.forEach((item) => {
        idList.push(item.id);
      });
      getBlankingList(idList).then((response) => {
        console.log("获取下料列表数据", response);
        let obj = {
          id: idList[0],
          dispatch: "1",
        };
        prodOrderInfo(obj).then((res) => {
          res.data.workOrderList.forEach((item) => {
            item.dispatchQuantity =
              Number(item.workOrderQuantity) - Number(item.dispatchedQuantity);
          });
          res.data.workOrderList.forEach((item) => {
            // if (item.routingProResMap.work_group && item.routingProResMap.work_group.length == 1) {
            //     item.workGroupId = item.routingProResMap.work_group[0].resourceId
            // }
            // if (item.routingProResMap.device && item.routingProResMap.device.length == 1) {
            //     item.equipmentId = item.routingProResMap.device[0].resourceId

            // }
            // if (item.routingProResMap.personnel && item.routingProResMap.personnel.length == 1) {
            //     item.personId = item.routingProResMap.personnel[0].resourceId

            // }
            item.personId = "";
            item.workGroupId = "";
            item.equipmentId = "";

            item.personName = "";
            item.workGroupName = "";
            item.equipmentName = "";
            if (item.routingProResMap.personnel) {
              item.personId = item.routingProResMap.personnel[0].resourceId;
              item.personName = item.routingProResMap.personnel[0].resourceName;
            }
            if (
              item.routingProResMap.work_group &&
              item.routingProResMap.work_group.length == 1
            ) {
              item.workGroupId = item.routingProResMap.work_group[0].resourceId;
              item.workGroupName =
                item.routingProResMap.work_group[0].resourceName;
            }
            if (
              item.routingProResMap.device &&
              item.routingProResMap.device.length == 1
            ) {
              item.equipmentId = item.routingProResMap.device[0].resourceId;
              item.equipmentName = item.routingProResMap.device[0].resourceName;
            }
            if (item.firstFlag) {
              response.data.forEach((items) => {
                items.routingProResMap = item.routingProResMap;
                items.workGroupId = item.workGroupId;
                items.workGroupName = item.workGroupName;
                items.equipmentId = item.equipmentId;
                items.equipmentName = item.equipmentName;
                items.personId = item.personId;
                items.personName = item.personName;
                items.processingType = item.processingType;
              });
            }
          });

          response.data.forEach((items) => {
            items.dispatchQuantity =
              items.workOrderQuantity - items.blankingQuantity;
            items.workOrderType = "normal";
          });

          this.blankingForm.blankingList = JSON.parse(JSON.stringify(response.data));
          this.blankingForm.productDrawingNo =
            this.blankingForm.blankingList[0].productDrawingNo;
          this.blankingForm.productName =
            this.blankingForm.blankingList[0].productName;

          console.log(
            "this.blankingForm.blankingList",
            this.blankingForm.blankingList
          );
          let objs = {
            code: "",
            createByName: "",
            endTime: "",
            keyword: "",
            name: "",
            orderItems: [
              {
                asc: true,
                column: "",
              },
            ],
            pageNum: 1,
            pageSize: -1,
            startTime: "",
            state: "",
          };
          // 获取产线
          getProductionLineList(objs).then((res) => {
            console.log("产线", res);
            this.lineList = res.data.records;
          });
        });
      });
      let obj = {
        id: data[0].id,
        dispatch: "1",
      };
    },
    fmatDateFun(data){
            const date = new Date(data);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // 月份从0开始，所以要加1
            const day = date.getDate();

            const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
            return formattedDate
        },
    async handleConfirm() {
      let form_2 = this.$refs["productForm"];
      let valid_2 = await form_2.validate().catch((err) => false);
      console.log(valid_2, "1111");
      this.$refs["dataForms"].validate((valid) => {
        if (valid) {
          const date1 = new Date(this.blankingForm.planStartDate);
          const date2 = new Date(this.blankingForm.planEndDate);
          let flag = null;
          if (date1.getTime() > date2.getTime()) {
            flag = false;
            this.$message({
              message: "计划结束日期不能在计划开始日期之前",
              type: "error",
            });
            return;
          }
          if (!valid_2) {
            console.log(1);
            this.btnLoading = false;
            for (
              let index = 0;
              index < this.blankingForm.blankingList.length;
              index++
            ) {
              const item = this.blankingForm.blankingList[index];
              console.log();
              if (!item.dispatchQuantity) {
                this.$message({
                  message: "第" + (index + 1) + "行派工数量不能为0、为空",
                  type: "error",
                  duration: 1500,
                });
                break;
              }
            }
          } else {
            let submitFlag = null;
            for ( let index = 0; index < this.blankingForm.blankingList.length; index++  ) {
              const item = this.blankingForm.blankingList[index];
        
              item.planStartDate = this.fmatDateFun(this.blankingForm.planStartDate);
              item.planEndDate = this.fmatDateFun(this.blankingForm.planEndDate);
              if (
                Number(item.dispatchQuantity) + Number(item.blankingQuantity) >
                Number(item.workOrderQuantity)
              ) {
                submitFlag = false;
                this.btnLoading = false;
                this.$message({
                  message:
                    "第" +
                    (index + 1) +
                    "行派工数量+已派工数量不能超过需生产数量",
                  type: "error",
                  duration: 1500,
                });
                break;
              }
              if (!item.workGroupId && !item.equipmentId && !item.personId) {
                submitFlag = false;
                this.btnLoading = false;
                this.$message({
                  message:
                    "第" + (index + 1) + "行班组、设备、人员需要必填一项",
                  type: "error",
                });
                break;
              }
            }
            console.log(
              "this.blankingForm.blankingList",
              this.blankingForm.blankingList
            );

            if (submitFlag === false) return;
            this.btnLoading = true;
            this.blankingForm.planEndDate=this.fmatDateFun(this.blankingForm.planEndDate)
            this.blankingForm.planStartDate=this.fmatDateFun(this.blankingForm.planStartDate)
            batchBlanking(this.blankingForm.blankingList).then((res) => {
              console.log("批量派工结果", res);

              this.$message({
                message: "批量下料成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.btnLoading = false;
                  this.$emit("close", true);
                },
              });
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.JNPF-common-table {
  border: 1px solid #ebeef5 !important;
}

// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
}

::v-deep .el-tabs__header {
  padding-left: 0 !important;
}

.el-button--small {
  // padding: 1;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  padding: 0 20px;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
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

::v-deep .el-table__body-wrapper {
  height: auto !important;
}

.tableContainer {
  flex: 1 0 0;
  height: auto;
  overflow: hidden;
}

.el-form-item--small.el-form-item {
  margin-bottom: 0;
}

::v-deep .applySelect .el-icon-arrow-up:before {
  content: "";
}

.underline-button {
  text-decoration: underline;
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

.personBox p {
  text-align: center;
}

.personBox:nth-child(n + 6) {
  margin-top: 12px;
}

::v-deep .elbutton span {
  font-size: 14px !important;
}

::v-deep.routingProRes .el-dialog__body {
  height: 500px;
}
</style>