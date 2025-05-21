<template>
  <div class="JNPF-common-layout">

    <div class="JNPF-common-layout-center JNPF-flex-main">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="aaa">
        <el-tab-pane label="扫码报工" name="scanCode" class="scanCode">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <div class="scanCodeTent">
              <div class="searchregion">
                <!-- <el-input v-model="scanResult" placeholder="您可以扫描生产任务码、工单码、工序码、产线码、班组码、员工码、设备码" @keyup.enter.native="searchResult()" -->
                <el-input v-model="scanResult" placeholder="您可以扫描生产任务码、工序码" @keyup.enter.native="searchResult()"
                  class="scanResultIpt"></el-input>
                <div style="background: #55d47e;margin-top: 10px">
                  <img src="../../../assets/images/erwmbai.gif" alt="" class="scanImg">
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="按生产任务报工" name="produce">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.orderNo" @keyup.enter.native="searchProductData()"
                      placeholder="生产任务单号" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="produceForm.productDrawingNo" @keyup.enter.native="searchProductData()"
                      placeholder="品名规格" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-date-picker v-model="planDate" type="daterange" value-format="yyyy-MM-dd" style="width: 100%;"
                      :picker-options="pickerOptions" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>

                </el-col>
                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProductData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetProduceData()">{{
                      $t('common.reset') }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <el-row :gutter="10" class="content_box">
                <el-col :span="6" v-for="(item, index) in produceData" :key="index">
                  <el-card class="box-card" shadow="hover">
                    <div slot="header" class="clearfix">
                      <span class="orderNo">单号：{{ item.orderNo }}</span>
                    </div>
                    <!-- <div class="label_title"> 品名规格:{{item.productDrawingNo}}</div>                    -->
                    <div class="label_title"> 品名规格:{{ item.productDrawingNo }}</div>
                    <div class="label_title bold" style="color: #3fb9f8;"> 总生产数量:<span>{{ item.productionQuantity
                        }}</span></div>
                    <div class="label_title bold" style="color: #67c23A;"> 已完成数量:<span>{{ item.completedQuantity
                        }}</span></div>
                    <div class="label_title bold" style="color: #e6a23c;"> 未完成数量:<span>{{ item.uncompletedQuantity
                        }}</span></div>
                    <div class="label_title"> 计划日期:{{ item.planStartDate }}—{{ item.planEndDate }}</div>
                    <div>
                      <el-button style="color:red;" type="text" @click="closeTaskFun(item)">关单</el-button>
                      <el-button type="primary" size="mini" @click='produceTaskReportFun(item.id)'>报 工</el-button>
                      <el-button type="primary" size="mini" @click="viewTask(item)">查看任务</el-button>
                    </div>
                  </el-card>

                </el-col>


              </el-row>
              <pagination :total="produceTotal" :page.sync="produceForm.pageNum" :limit.sync="produceForm.pageSize"
                @pagination="searchProductData">
              </pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="按产线报工" name="produceLine">
          <div class="JNPF-common-layout">

            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="produceLineForm.name" @keyup.enter.native="searchProduceLineData()"
                        placeholder="产线名称" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="produceLineForm.code" @keyup.enter.native="searchProduceLineData()"
                        placeholder="产线编码" clearable />
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProduceLineData()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetProduceLineData()">{{
                        $t('common.reset') }}
                      </el-button>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div class="JNPF-common-layout-main JNPF-flex-main">
                <el-row :gutter="10" class="content_boxt">
                  <el-col :span="4" v-for="(item, index) in produceLineData" :key="index">
                    <el-card class="box-card" shadow="hover">

                      <div class="label_title"> 产线名称:{{ item.name }}</div>
                      <div class="label_title"> 产线编码:{{ item.code }}</div>
                      <div class="label_title bold" style="color: #3fb9f8;"> 总生产数量:<span>{{ item.productionQuantity}}</span></div>
                      <div class="label_title bold" style="color: #67c23A;"> 已完成数量:<span>{{ item.qualifiedQuantity}}</span></div>
                      <div class="label_title bold" style="color: #e6a23c;"> 未完成数量:<span>{{ item.unqualifiedQuantity }}</span></div>
                      <div style="margin-top: 10px;">
                        <el-button type="primary" size="mini" @click="produceLineReportFun(item)">报 工</el-button>
                      </div>
                    </el-card>
                  </el-col>



                </el-row>
                <pagination :total="produceLineTotal" :page.sync="produceLineForm.pageNum"
                  :limit.sync="produceLineForm.pageSize" @pagination="searchProduceLineData">
                </pagination>
              </div>
            </div>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="按工序报工" name="process">
          <div class="JNPF-common-layout">

            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="processForm.name" @keyup.enter.native="searchProductData()" placeholder="工序名称"
                        clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="processForm.code" @keyup.enter.native="searchProductData()" placeholder="工序编码"
                        clearable />
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProcessData()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetProcessData()">{{
                        $t('common.reset') }}
                      </el-button>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div class="JNPF-common-layout-main JNPF-flex-main">
                <el-row :gutter="10" class="content_boxt">
                  <el-col :span="4" v-for="(item, index) in ProcessData" :key="index">
                    <el-card class="box-card" shadow="hover">

                      <div class="label_title"> 工序名称:{{ item.name }}</div>
                      <div class="label_title"> 工序编码:{{ item.code }}</div>
                      <div class="label_title bold" style="color: #3fb9f8;"> 总生产数量:<span>{{ item.productionQuantity}}</span></div>
                      <div class="label_title bold" style="color: #67c23A;"> 已完成数量:<span>{{ item.qualifiedQuantity}}</span></div>
                      <div class="label_title bold" style="color: #e6a23c;"> 未完成数量:<span>{{ item.unqualifiedQuantity }}</span></div>
                      <div class="label_title bold" style="color: #993255;"> 可报工数量:<span>{{ item.waitReportNum }}</span></div>
                      <div style="margin-top: 10px;">
                        <el-button type="primary" size="mini" @click="ProcessReportFun(item)">报 工</el-button>
                      </div>
                    </el-card>
                  </el-col>



                </el-row>
                <pagination :total="processTotal" :page.sync="processForm.pageNum" :limit.sync="processForm.pageSize"
                  @pagination="searchProcessData">
                </pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="按班组报工" name="workgroup">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workGroupForm.name" @keyup.enter.native="searchWorkGroupData()" placeholder="名称"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="workGroupForm.code" @keyup.enter.native="searchWorkGroupData()" placeholder="编码"
                      clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchWorkGroupData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetWorkGroup()">{{ $t('common.reset')
                      }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <el-row :gutter="10" class="content_boxt">
                <el-col :span="4" v-for="(item, index) in groupData" :key="index">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 班组名称:{{ item.name }}</div>
                    <div class="label_title"> 班组编码:{{ item.code }}</div>
                    <div class="label_title bold" style="color: #3fb9f8;"> 总生产数量:<span>{{ item.productionQuantity}}</span></div>
                      <div class="label_title bold" style="color: #67c23A;"> 已完成数量:<span>{{ item.qualifiedQuantity}}</span></div>
                      <div class="label_title bold" style="color: #e6a23c;"> 未完成数量:<span>{{ item.unqualifiedQuantity }}</span></div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini" @click="groupReportFun(item)">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>


              </el-row>
              <pagination :total="groupTotal" :page.sync="workGroupForm.pageNum" :limit.sync="workGroupForm.pageSize"
                @pagination="searchWorkGroupData">
              </pagination>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="按人员报工" name="person">
          <div class="JNPF-common-layout">
            <div class="JNPF-common-layout-left treeBox" :style="leftFlag ? 'width:15px;background:#fff' : ''">
              <div class="JNPF-common-title" style="display: block;padding:0" v-if="!leftFlag">
                <div class="title_box">
                  <h2>组织机构</h2>
                  <span class="options">
                    <el-dropdown>
                      <el-link icon="icon-ym icon-ym-mpMenu" :underline="false" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="getOrganizeList()">刷新数据</el-dropdown-item>
                        <el-dropdown-item @click.native="toggleExpand(true)">展开全部</el-dropdown-item>
                        <el-dropdown-item @click.native="toggleExpand(false)">折叠全部</el-dropdown-item>
                        <el-dropdown-item @click.native="setexpand(true)">设置默认展开</el-dropdown-item>
                        <el-dropdown-item @click.native="setexpand(false)">设置默认收起</el-dropdown-item>
                        <el-dropdown-item @click.native="showDiagram">架构图</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </div>
                <div> <el-input placeholder="输入关键字进行过滤" v-model="filterText"
                    style="width:200px;margin:10px auto;display:block" suffix-icon="el-icon-search" clearable>
                  </el-input></div>
              </div>

              <el-scrollbar class="JNPF-common-el-tree-scrollbar" v-loading="treeLoading" v-if="!leftFlag">
                <el-tree ref="routingTreeBox" :data="filteredTree" :props="defaultPropsPerson"
                  :default-expand-all="expands" highlight-current :expand-on-click-node="false" node-key="id"
                  @node-click="handleNodeClickPerson" class="JNPF-common-el-tree" v-if="refreshTree"
                  :filter-node-method="filterNodePerson">
                  <span class="custom-tree-node" slot-scope="{ data }" :title="data.fullName">

                    <span class="text" :title="data.fullName">{{ data.fullName }}</span>
                  </span>
                </el-tree>
              </el-scrollbar>
              <div v-if="!leftFlag" class="retract" style="position: absolute">
                <el-button icon="el-icon-arrow-left" type="text" @click.native="changeLeft()"></el-button>
              </div>
              <div v-if="leftFlag" class="expand" style="position: absolute">
                <el-button icon="el-icon-arrow-right" type="text" @click.native="changeLeft()"></el-button>
              </div>
            </div>
            <div class="JNPF-common-layout-center JNPF-flex-main">
              <el-row class="JNPF-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>

                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="personForm.realName" @keyup.enter.native="searchPersonData()" placeholder="姓名"
                        clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item>
                      <el-input v-model="personForm.account" @keyup.enter.native="searchPersonData()" placeholder="账号"
                        clearable />
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchPersonData()">
                        {{ $t('common.search') }}</el-button>
                      <el-button size="mini" icon="el-icon-refresh-right" @click="resetPersonData()">{{
                        $t('common.reset') }}
                      </el-button>
                    </el-form-item>
                  </el-col>

                </el-form>
              </el-row>
              <div class="JNPF-common-layout-main JNPF-flex-main">

                <el-row :gutter="10" class="content_boxt">
                  <el-col :span="4" v-for="(item, index) in personData" :key="index">
                    <el-card class="box-card" shadow="hover">

                      <div class="label_title"> 名称:{{ item.realName }}</div>
                      <div class="label_title"> 账号:{{ item.account }}</div>
                      <div class="label_title bold" style="color: #3fb9f8;"> 总生产数量:<span>{{ item.productionQuantity}}</span></div>
                      <div class="label_title bold" style="color: #67c23A;"> 已完成数量:<span>{{ item.qualifiedQuantity}}</span></div>
                      <div class="label_title bold" style="color: #e6a23c;"> 未完成数量:<span>{{ item.unqualifiedQuantity }}</span></div>
                      <div style="margin-top: 10px;">
                        <el-button type="primary" size="mini" @click="personReportFun(item)">报 工</el-button>
                      </div>
                    </el-card>
                  </el-col>


                </el-row>
                <pagination :total="personTotal" :page.sync="personForm.pageNum" :limit.sync="personForm.pageSize"
                  @pagination="searchPersonData">
                </pagination>
              </div>
            </div>
          </div>


        </el-tab-pane>
        <el-tab-pane label="按设备报工" name="device">
          <div class="JNPF-common-layout-center JNPF-flex-main">
            <el-row class="JNPF-common-search-box" :gutter="16">
              <el-form @submit.native.prevent>

                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="deviceForm.name" @keyup.enter.native="searchDeviceData()" placeholder="名称"
                      clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item>
                    <el-input v-model="deviceForm.code" @keyup.enter.native="searchDeviceData()" placeholder="编码"
                      clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click="searchDeviceData()">
                      {{ $t('common.search') }}</el-button>
                    <el-button size="mini" icon="el-icon-refresh-right" @click="resetDevice()">{{ $t('common.reset')
                      }}
                    </el-button>
                  </el-form-item>
                </el-col>

              </el-form>
            </el-row>
            <div class="JNPF-common-layout-main JNPF-flex-main">

              <el-row :gutter="10" class="content_boxt">
                <el-col :span="4" v-for="(item, index) in deviceData" :key="index">
                  <el-card class="box-card" shadow="hover">

                    <div class="label_title"> 设备名称:{{ item.name }}</div>
                    <div class="label_title"> 设备编码:{{ item.code }}</div>
                    <div class="label_title bold" style="color: #3fb9f8;"> 总生产数量:<span>{{ item.productionQuantity}}</span></div>
                      <div class="label_title bold" style="color: #67c23A;"> 已完成数量:<span>{{ item.qualifiedQuantity}}</span></div>
                      <div class="label_title bold" style="color: #e6a23c;"> 未完成数量:<span>{{ item.unqualifiedQuantity }}</span></div>
                    <div style="margin-top: 10px;">
                      <el-button type="primary" size="mini" @click="deviceReportFun(item)">报 工</el-button>
                    </div>
                  </el-card>
                </el-col>


              </el-row>
              <pagination :total="deviceTotal" :page.sync="deviceForm.pageNum" :limit.sync="deviceForm.pageSize"
                @pagination="searchDeviceData">
              </pagination>
            </div>
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>


    <taskForm v-if="taskFormVisible" ref="taskForm" @refreshDataList="searchProductData" @close="closeForm" :noNeedOutFlag="true"></taskForm>
    <produceTaskReportForm v-if="produceTaskReportVisible" ref="produceTaskReportForm"
      @refreshDataList="searchProductData" @close="closeForm"></produceTaskReportForm>
    <ProcessReportForm v-if="ProcessReportVisible" ref="ProcessReportForm" @refreshDataList="searchProcessData"
      @close="closeForm"></ProcessReportForm>
    <GroupReportForm v-if="groupReportVisible" ref="GroupReportForm" @refreshDataList="searchWorkGroupData"
      @close="closeForm"></GroupReportForm>
    <PersonReportForm v-if="personReportVisible" ref="PersonReportForm" @refreshDataList="searchPersonData"
      @close="closeForm"></PersonReportForm>
    <DeviceReportForm v-if="deviceReportVisible" ref="DeviceReportForm" @refreshDataList="searchdeviceData"
      @close="closeForm"></DeviceReportForm>
    <ProduceLineReportForm v-if="produceLineReportVisible" ref="ProduceLineReportForm"
      @refreshDataList="searchProduceLineData" @close="closeForm"></ProduceLineReportForm>
  </div>
</template>

<script>
import { prodOrderClose } from '@/api/productOrdes/finishedProductOrders.js'
import { ordershengchanList, addOrderNum, getscanResultData } from '@/api/productOrdes/index.js'
import taskForm from '@/views/productionManagement/ringPlan/ringTaskManagement/taskFormCopy.vue'
import Diagram from '@/views/permission/user/Diagram.vue' // 树状列表-组织机构
import { getGroupList, getEquEquipmentList, getProductionLineList } from '@/api/basicData/index.js'
import { getProcessList, detailProcess } from '@/api/basicData/processSettingss.js'
import { getBimProcessList } from "@/api/bimProcess/index.js"

import produceTaskReportForm from './produceTaskReportForm.vue'
import moment from 'moment'
import ExportForm from '@/components/no_mount/ExportBox/index'
import ProcessReportForm from './processReportForm.vue'
import GroupReportForm from './groupReprotForm.vue'
import PersonReportForm from './personReportForm.vue'
import DeviceReportForm from './deviceReportForm.vue'
import ProduceLineReportForm from './ProduceLineForm.vue'
import { getDepartmentSelectorByAuth } from '@/api/permission/department'
import { getUserListPost } from '@/api/permission/user'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'ringCompletionReport',
  components: { ExportForm, Diagram, taskForm, produceTaskReportForm, ProcessReportForm, GroupReportForm, PersonReportForm, DeviceReportForm, ProduceLineReportForm },
  mixins: [getProjectList],
  data() {
    return {
      isProjectSwitch: '',
      defaultPropsPerson: {
        children: 'children',
        label: 'fullName'
      },
      produceLineReportVisible: false,
      personReportVisible: false,
      groupReportVisible: false,
      ProcessReportVisible: false,
      deviceReportVisible: false,
      routingList: "",
      treeLoading: false,
      expands: true,
      refreshTree: true,
      produceTaskReportVisible: false,
      scanResult: "",
      superQueryVisible: false,
      activeName: "scanCode",
      leftFlag: false,

      selectArr: [],
      taskFormVisible: false,
      produceTotal: 0,
      produceData: [],
      produceForm: {
        orderNo: "",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        orderStatus: "normal",
        documentStatus: "submit",
        classAttribute: "semi_finished",
        pageNum: 1,
        pageSize: 20,
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
      },
      planDate: [],
      orderTypeList: [
        { label: "正常任务", value: "normal" },
        { label: "返工任务", value: "rework" },
      ],

      processForm: {
        productClassAttribute:"semi_finished",
        workReportFlag:true,
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 24,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "reporting_sort"
        }],

      },
      processTotal: 0,
      ProcessData: [],




      personTotal: 0,
      personData: [],

      groupTotal: 0,
      groupData: [],
      workGroupForm: {
        productClassAttribute:"semi_finished",
        workReportFlag:true,
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      },
      personForm: {
        productClassAttribute:"semi_finished",
        workReportFlag:true,
        organizeId: "",
        account: "",
        realName: "",
        employeeStatus: "on_job",
        employeeType: "",
        orderItems: [
          {
            asc: true,
            column: ""
          },
          {
            asc: false,
            column: "f_entrydate"
          }
        ],
        organizeId: "",
        pageNum: 1,
        pageSize: 20,
      },
      treeLoading: false,
      treeData: [],
      filterText: "",
      routingfilterText: "",
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },

      deviceForm: {
        productClassAttribute:"semi_finished",
        workReportFlag:true,
        classAttribute: "equipment",
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
      deviceData: [],
      deviceTotal: 0,

      produceLineData: [],
      produceLineTotal: 0,
      produceLineForm: {
        productClassAttribute:"semi_finished",
        workReportFlag:true,
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },


      routingForm: {
        orderItems:
          [
            { "asc": false, "column": "" },
            { "asc": false, "column": "create_time" }
          ],
        "pageNum": -1,
        "pageSize": 20,
        "code": "",
        "name": "",
        "state": "",
        "approvalStatus": "",
        "documentStatus": "",
        "createEndTime": "",
        "createStartTime": ""
      },
      filteredTree: [],




    }
  },
  watch: {
    filterText(val) {
      this.filterTree();
    },
    // 监听树形数据变化
    treeData: {
      handler: function (val) {
        this.filterTree();
      },
      deep: true,
    },
    routingfilterText(val) {
      this.$refs.routingTreeBox.filter(val)

    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
 
  },
  methods: {
    closeTaskFun(row) {
      this.$confirm('您确认关闭当前任务吗？', this.$t('common.tipTitle'), {
        type: 'warning',
        customClass: 'custom-confirm',
      }).then(() => {
        let arr = []
        arr.push(row.id)
        prodOrderClose(arr).then(res => {
          this.$message.success("关单成功")
          this.searchProductData()
          arr = []
        }).catch(() => {

        })

      }).catch(() => { })

    },

    closeForm(flag) {
      this.taskFormVisible = false
      this.produceTaskReportVisible = false
      this.ProcessReportVisible = false
      this.groupReportVisible = false
      this.personReportVisible = false
      this.deviceReportVisible = false
      this.produceLineReportVisible = false
      if (flag) {
        if (this.activeName == 'produce') {
          this.searchProductData()
        } else if (this.activeName == 'process') {
          this.searchProcessData()
        } else if (this.activeName == 'workgroup') {
          this.searchWorkGroupData()
        } else if (this.activeName == 'device') {
          this.searchDeviceData()
        } else if (this.activeName == 'produceLine') {
          this.searchProduceLineData()
        } else {
          this.getOrganizeList()
          this.searchPersonData()

        }
      }

    },
    // 扫码报工页面  搜索
    searchResult() {
      if (this.scanResult) {

        getscanResultData({ code: this.scanResult, classAttribute: "semi_finished" }).then(res => {
          console.log("扫码查找数据", res);
          if (res.data) {
            if (res.data.type == 'prod_order') {
              this.produceTaskReportFun(res.data.docId)
            } else if (res.data.type == 'process') {
              this.ProcessReportFun(res.data.docId)

            } else if (res.data.type == 'personnel') {
              this.personReportFun(res.data.docId)

            } else if (res.data.type == 'produceLine') {
              this.produceLineReportFun(res.data.docId)

            } else if (res.data.type == 'device') {
              this.deviceReportFun(res.data.docId)
            } else if (res.data.type == 'work_group') {
              this.groupReportFun(res.data.docId)

            }
          }
        })

      }
    },
    handleClick() {
      if (this.activeName == 'produce') {
        this.searchProductData()
      } else if (this.activeName == 'process') {
        this.searchProcessData()
      } else if (this.activeName == 'workgroup') {
        this.searchWorkGroupData()
      } else if (this.activeName == 'produceLine') {
        this.searchProduceLineData()
      } else if (this.activeName == 'device') {
        this.searchDeviceData()
      } else {
        this.getOrganizeList()
        this.searchPersonData()

      }
    },

    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    columnSetFun() {

    },
    // 多选
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //禁用复选框
    checkSelectable(row) {
      if (row.orderStatus !== 'normal' || row.orderStatus == 'suspend' || row.documentStatus == 'draft') {
        console.log(222);
        return false
      } else {
        console.log(333);
        return true

      }
    },
 
    // 生产任务列表
    searchProductData() {
      if (this.planDate.length) {
        this.produceForm.planSsd = this.planDate[0]
        this.produceForm.planSed = this.planDate[1]
      } else {
        this.produceForm.planSsd = ""
        this.produceForm.planSed = ""
      }
      this.listLoading = true
      this.produceForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      ordershengchanList(this.produceForm).then(res => {
        res.data.records.forEach(item => {
          let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.productionQuantity, item.completedQuantity]), 6)
          this.$set(item, 'uncompletedQuantity', num)
        });
        this.produceData = res.data.records
        this.produceTotal = res.data.total
        this.listLoading = false
      }).catch(error => {
        this.listLoading = false

      })
    },
    resetProduceData() {
      this.planDate = []
      this.produceForm = {
        orderNo: "",
        productDrawingNo: "",
        planSsd: "",
        planSed: "",
        orderStatus: "normal",
        documentStatus: "submit",
        classAttribute: "semi_finished",
        pageNum: 1,
        pageSize: 20,
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
      }
      this.searchProductData()
    },
    // 查看任务
    viewTask(data) {
      this.taskFormVisible = true
      this.$nextTick(() => {
        this.$refs.taskForm.init(data.id, 'all')
      })
    },
    // 生产任务报工
    produceTaskReportFun(id) {
      this.produceTaskReportVisible = true
      this.$nextTick(() => {
        this.$refs.produceTaskReportForm.init(id)
      })
    },
    // 工序
    searchProcessData() {
      this.processForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getBimProcessList(this.processForm).then(res => {
        res.data.records.forEach(item => {
          let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.productionQuantity, item.qualifiedQuantity]), 6)
          this.$set(item, 'unqualifiedQuantity', num)
        });
        this.ProcessData = res.data.records
        this.processTotal = res.data.total
      })
    },
    ProcessReportFun(row) {
      this.ProcessReportVisible = true
      this.$nextTick(() => {
        this.$refs.ProcessReportForm.init(row)
      })
    },
    resetProcessData() {
      this.processForm = {
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 24,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "reporting_sort"
        }],
        productClassAttribute: "semi_finished",
        workReportFlag:true,
      }
      this.searchProcessData()
    },
    // 产线
    searchProduceLineData() {
      getProductionLineList(this.produceLineForm).then(res => {
        res.data.records.forEach(item => {
          let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.productionQuantity, item.qualifiedQuantity]), 6)
          this.$set(item, 'unqualifiedQuantity', num)
        });
        this.produceLineData = res.data.records
        this.produceLineTotal = res.data.total
      })
    },
    resetProduceLineData() {
      this.produceLineForm = {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      }
      this.searchProduceLineData()
    },

    // 班组  点击报工
    produceLineReportFun(data) {
      this.produceLineReportVisible = true
      this.$nextTick(() => {
        this.$refs.ProduceLineReportForm.init(data)
      })
    },
    // 班组列表
    searchWorkGroupData() {
      getGroupList(this.workGroupForm).then(res => {
        res.data.records.forEach(item => {
          let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.productionQuantity, item.qualifiedQuantity]), 6)
          this.$set(item, 'unqualifiedQuantity', num)
        });
        console.log("班组", res);
        this.groupData = res.data.records
        this.groupTotal = res.data.total
      })
    },
    resetWorkGroup() {
      this.workGroupForm = {
        code: "",
        name: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],

      }
      this.searchWorkGroupData()
    },
    // 班组  点击报工
    groupReportFun(data) {
      this.groupReportVisible = true
      this.$nextTick(() => {
        this.$refs.GroupReportForm.init(data)
      })
    },


    personReportFun(data) {
      this.personReportVisible = true
      this.$nextTick(() => {
        this.$refs.PersonReportForm.init(data)
      })
    },
    // 人员列表
    searchPersonData() {
      getUserListPost(this.personForm).then(res => {
        res.data.records.forEach(item => {
          let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.productionQuantity, item.qualifiedQuantity]), 6)
          this.$set(item, 'unqualifiedQuantity', num)
        });
        this.personData = res.data.records
        this.personTotal = res.data.total
      })
    },
    resetPersonData() {
      this.personForm = {
        organizeId: "",
        account: "",
        realName: "",
        employeeStatus: "on_job",
        employeeType: "",
        orderItems: [
          {
            asc: true,
            column: ""
          },
          {
            asc: false,
            column: "f_entrydate"
          }
        ],
        organizeId: "",
        pageNum: 1,
        pageSize: 20,
      },
        this.searchPersonData()
    },
    // 人员  ——左侧数据
    getOrganizeList() {
      this.routfi = ''
      this.treeLoading = true
      this.personForm.organizeId = ''
      getDepartmentSelectorByAuth().then(res => {
        this.treeData = res.data.list
        this.treeLoading = false
      }).catch(() => {
        this.treeLoading = false
      })
    },

    // // 设置默认展开
    setexpand(expands) {
      console.log("expands", expands);
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        localStorage.setItem("userReportFlag", expands)

      })
    },
    // 架构图
    showDiagram() {
      this.diagramVisible = true
      this.$nextTick(() => {
        this.$refs.Diagram.init()
      })
    },
    // 设备
    searchDeviceData() {
      getEquEquipmentList(this.deviceForm).then(res => {
        res.data.records.forEach(item => {
          let num = this.jnpf.numberFormat(this.jnpf.math('subtract', [item.productionQuantity, item.qualifiedQuantity]), 6)
          this.$set(item, 'unqualifiedQuantity', num)
        });
        this.deviceData = res.data.records
        this.deviceTotal = res.data.total
      })
    },
    resetDevice() {
      this.deviceForm = {
        name: "",
        code: "",
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
      },
        this.searchDeviceData()

    },
    deviceReportFun(data) {
      this.deviceReportVisible = true
      this.$nextTick(() => {
        this.$refs.DeviceReportForm.init(data)
      })
    },

    filterNodePerson(value, data) {
      return !value || data.fullName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    filterNodes(node) {
      let matched = this.filterNode(this.filterText, node);
      if (!matched && node.children) {
        node.children = node.children.filter(childNode => {
          const matchedChild = this.filterNodes(childNode);
          return matchedChild;
        });
        matched = node.children.length > 0;
      }
      return matched;
    },
    filterTree() {
      if (!this.filterText) {
        // 如果搜索框内容为空，展示全部树形结构数据
        this.filteredTree = this.treeData;
        console.log("object", this.filteredTree);
        return;
      }
      const filteredTreeData = JSON.parse(JSON.stringify(this.treeData));
      this.filteredTree = filteredTreeData.filter(node => {
        return this.filterNodes(node);
      });
    },
    handleNodeClickPerson(data) {
      if (this.listQuery.organizeId === data.id) return
      this.personForm.organizeId = data.id
      this.searchPersonData()
    },













    filterNode(value, data) {
      console.log(value, data);
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 点击左侧工艺路线查找对应的工序
    handleNodeClickRouting(data, node) {
      console.log("工艺信息", node);
      detailProcess(node.data.id).then(res => {
        console.log("工艺详情", res);
        res.data.routingLineList.forEach(item => {
          item.name = item.processName
          item.code = item.processCode
        });
        this.ProcessData = res.data.routingLineList
        this.processTotal = res.data.routingLineList.length
      })
    },
    sortChange({ prop, order }) {
      let newProp;
      if (prop === 'cooperativePartnerName' || prop === 'cooperativePartnerCode' || prop === 'sealingRingName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      if (prop == "createByName") {
        newProp = "create_by"
      }
      this.orderForm.orderItems[0].asc = order === "ascending"
      this.orderForm.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },

    changeLeft() {
      this.leftFlag = !this.leftFlag

    },
    toggleExpand(expands) {
      this.refreshTree = false
      this.expands = expands
      this.$nextTick(() => {
        this.refreshTree = true
        this.$nextTick(() => {
          this.$refs.treeBox.setCurrentKey(this.companyId)
        })
      })
    },

  }
}
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
  padding-top: 10px;
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

.aaa ::v-deep .el-tabs__header {
  padding: 0 !important;
  padding-bottom: 0px !important;
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

::v-deep .el-pagination {
  padding: 7px 5px;
}

.content_box {
  padding: 10px;
  overflow-y: auto;
  height: 100%
}

.content_boxt {
  padding: 10px;
  overflow-y: auto;
  height: 100%
}

.content_boxt .el-col:nth-child(n+7) {
  margin-top: 10px;
}

.content_boxts .el-col:nth-child(n+7) {
  margin-top: 10px;
}

.content_box::-webkit-scrollbar {
  display: none;
  /* Safari 和 Chrome */
}

.box {
  height: 197px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px
}

.content_box :nth-child(n+5) {
  margin-top: 10px;
}

.label_title {
  margin-top: 10px;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 隐藏超出的内容 */
  text-overflow: ellipsis;
}

::v-deep .el-card__body {
  padding: 10px;
  padding-top: 0;
}

::v-deep .el-card__header {
  padding: 10px;
}

.orderNo {
  vertical-align: sub;
}

.pagination-container {
  background-color: #f5f7fa;
  margin-top: 0px;
  padding-right: 10px;
  padding-top: 2px;
  padding-bottom: 2px;
}

.scanCode {
  margin-top: 5px
}

.scanCode .JNPF-flex-main {
  height: 100%;
  display: inline-block;
  width: 100%;
}

.scanCodeTent {
  height: 100%;
  background: #fff;
  position: relative;
  overflow-y: auto;
}

.searchregion {
  position: absolute;
  width: 60%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;
  text-align: center;
}

.scanResultIpt {
  height: 60px;
}

.scanResultIpt ::v-deep .el-input__inner {
  height: 100%;
  font-size: 18px !important;
}

.searchBtn {
  height: 60px;
  font-size: 18px;
}

.scanImg {
  margin-top: 50px;
  padding-bottom: 50px;
}

.orderNo {
  font-size: 18px;
  font-weight: 600;
}

.title_box {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ebeef5;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  padding: 0 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

::v-deep .el-tabs__item {
  padding: 0 10px;
}

.bold {
  font-size: 18px;
  font-weight: 600;
}
</style>
