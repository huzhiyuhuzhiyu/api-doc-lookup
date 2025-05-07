<template>
  <div class="JNPF-common-layout">
    <div class="JNPF-common-layout-center JNPF-flex-main">
      <div style="overflow: auto;">
        <div class="group-container-body section has-hover">
          <div style="height: 65px;width: 100%;padding: 10px;">
            <div class="dash-rich-text">
              <div class="rich-text-content">维修统计分析</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 10px;" class="wx-content">
          <el-tabs type="border-card" style="height: 100%;" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="维修情况概览" name="wxqkgl">
              <div class="statistical">
                <div class="analysis-content">
                  <div v-for="item in datalistwx" :key="item.id" class="card-item has-hover">
                    <div class="container-header-l">{{item.name}}</div>
                    <div class="metric-view">
                      <div class="text-line">
                        <span style="font-size:34px;margin-right: 5px;">{{item.value}}</span>
                        <span>{{item.unit}}</span>
                      </div>
                    </div>
                  </div>
                  <card class="card-item" bodyheight="200px" title="设备维修工单数" :datalist="datalistobj"></card>
                </div>
                <div class="table-content">
                  <div style="margin-top: 15px;">
                    <el-row :gutter="16">
                      <el-form @submit.native.prevent>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-select v-model="listQuery.state" filterable placeholder="请选择状态" clearable style="width: 100%;">
                              <el-option v-for="item in StateList" :key="item.value" :label="item.label" :value="item.value">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                              {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-row>
                  </div>
                  <div style="height: 714px;" class="JNPF-flex-main" v-loading="listLoading">
                    <JNPF-table ref="dataTable" v-if="istable" :data="tableData" @sort-change="sortChange" custom-column customKey="JNPFTableKey_779183">
                      <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" sortable="custom" />
                      <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                      <el-table-column prop="factoryFloor" label="使用车间" min-width="140" />
                      <el-table-column prop="mountedPlaces" label="安装地点" min-width="140" />
                      <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
                        <template slot-scope="scope">
                          <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="faultStartTime" label="故障开始时间" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="reviewComments" label="审核意见" width="120">
                        <template slot-scope="scope">
                          <div v-if="scope.row.reviewComments == 'immediately'"><el-tag type="danger">立即维修</el-tag></div>
                          <div v-else-if="scope.row.reviewComments == 'reject'"><el-tag type="warning">驳回</el-tag></div>
                          <div v-else-if="scope.row.reviewComments == 'outsourcing'"><el-tag>转委外</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="rejectReason" label="驳回理由" min-width="160">
                        <template slot-scope="scope">
                          <div><el-tag type="success" v-if="scope.row.rejectReason">{{scope.row.rejectReason}}</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="degree" label="紧急程度" width="120">
                        <template slot-scope="scope">
                          <div v-if="scope.row.degree == '1'"><el-tag type="danger">特别紧急</el-tag></div>
                          <div v-else-if="scope.row.degree == '2'"><el-tag type="warning">紧急</el-tag></div>
                          <div v-else-if="scope.row.degree == '3'"><el-tag>一般</el-tag></div>
                          <div v-else-if="scope.row.degree == '4'"><el-tag type="success">不急</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="maintenancePersonnelName" label="维修负责人" width="120"></el-table-column>
                      <el-table-column prop="waitDuration" label="故障响应时长(小时)" min-width="180" />
                      <el-table-column prop="sparePartsFlag" label="是否更换备件" width="140">
                        <template slot-scope="scope">
                          <div v-if="scope.row.sparePartsFlag == '0'"><el-tag type="warning">否</el-tag></div>
                          <div v-else-if="scope.row.sparePartsFlag == '1'"><el-tag type="success">是</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="reason" label="故障原因" min-width="160" />
                      <el-table-column prop="solutionMeasures" label="解决措施" min-width="200"></el-table-column>
                      <el-table-column prop="afterPicList" label="维修完成拍照" min-width="160">
                        <template slot-scope="scope">
                          <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.afterPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="startMaintenanceTime" label="开始维修时间" width="180"></el-table-column>
                      <el-table-column prop="repairCompletionTime" label="维修完成时间" width="180"></el-table-column>
                      <el-table-column prop="maintenanceDuration" label="维修时长" min-width="160" sortable="custom"></el-table-column>
                      <el-table-column prop="equipmentState" label="设备状态" width="120">
                        <template slot-scope="scope">
                          <div v-if="scope.row.equipmentState == 'normal'"><el-tag type="success">正常</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'repair'"><el-tag type="warning">维修</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'discard'"><el-tag type="info">报废</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'spare'"><el-tag>备用</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'stop'"><el-tag type="danger">停用</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="departmentIdName" label="申请部门" min-width="120" />
                      <el-table-column prop="applicantIdName" label="申请人" width="120"></el-table-column>
                      <el-table-column prop="applicationDate" label="申请日期" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.state == 'toBeMaintain'"><el-tag type="danger">待维修</el-tag></div>
                          <div v-else-if="scope.row.state == 'maintaining'"><el-tag type="warning">正在维修</el-tag></div>
                          <div v-else-if="scope.row.state == 'maintained'"><el-tag type="success">已维修</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData" />
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="派工情况概览" name="pgqkgl">
              <div class="statistical">
                <div class="analysis-content">
                  <div class="wx-dash-chart has-hover">
                    <chart id="dispatchworkpie" :option="dispatchworkoption"></chart>
                  </div>
                  <div class="wx-dash-chart has-hover">
                    <chart id="supplierbar" :option="supplieroption"></chart>
                  </div>
                  <div class="wx-dash-chart has-hover">
                    <chart id="rejectpie" :option="rejectoption"></chart>
                  </div>
                </div>
                <div class="table-content">
                  <div style="margin-top: 15px;">
                    <el-row :gutter="16">
                      <el-form @submit.native.prevent>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQuery.equipmentIdCode" placeholder="请输入设备编码" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-input v-model="listQuery.equipmentIdName" placeholder="请输入设备名称" clearable @keydown.enter.native="search()" />
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click="search()">
                              {{ $t('common.search') }}</el-button>
                            <el-button size="mini" icon="el-icon-refresh-right" @click="reset()">{{ $t('common.reset') }}
                            </el-button>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-row>
                  </div>
                  <div style="height: 664px;" class="JNPF-flex-main" v-loading="listLoading">
                    <div class="container-header">
                      <div class="header-title">委外维修单明细</div>
                    </div>
                    <JNPF-table v-if="istable" ref="dataTable" :data="tableData" @sort-change="sortChange" custom-column customKey="JNPFTableKey_667646">
                      <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" sortable="custom" />
                      <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                      <el-table-column prop="factoryFloor" label="使用车间" min-width="140" />
                      <el-table-column prop="mountedPlaces" label="安装地点" min-width="140" />
                      <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
                        <template slot-scope="scope">
                          <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="faultStartTime" label="故障开始时间" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="reviewComments" label="审核意见" width="120">
                        <template slot-scope="scope">
                          <div v-if="scope.row.reviewComments == 'immediately'"><el-tag type="danger">立即维修</el-tag></div>
                          <div v-else-if="scope.row.reviewComments == 'reject'"><el-tag type="warning">驳回</el-tag></div>
                          <div v-else-if="scope.row.reviewComments == 'outsourcing'"><el-tag>转委外</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="rejectReason" label="驳回理由" min-width="160">
                        <template slot-scope="scope">
                          <div><el-tag type="success" v-if="scope.row.rejectReason">{{scope.row.rejectReason}}</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="degree" label="紧急程度" width="120">
                        <template slot-scope="scope">
                          <div v-if="scope.row.degree == '1'"><el-tag type="danger">特别紧急</el-tag></div>
                          <div v-else-if="scope.row.degree == '2'"><el-tag type="warning">紧急</el-tag></div>
                          <div v-else-if="scope.row.degree == '3'"><el-tag>一般</el-tag></div>
                          <div v-else-if="scope.row.degree == '4'"><el-tag type="success">不急</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="maintenancePersonnelName" label="维修负责人" width="120"></el-table-column>
                      <el-table-column prop="waitDuration" label="故障响应时长(小时)" min-width="180" />
                      <el-table-column prop="sparePartsFlag" label="是否更换备件" width="140">
                        <template slot-scope="scope">
                          <div v-if="scope.row.sparePartsFlag == '0'"><el-tag type="warning">否</el-tag></div>
                          <div v-else-if="scope.row.sparePartsFlag == '1'"><el-tag type="success">是</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="reason" label="故障原因" min-width="160" />
                      <el-table-column prop="solutionMeasures" label="解决措施" min-width="200"></el-table-column>
                      <el-table-column prop="afterPicList" label="维修完成拍照" min-width="160">
                        <template slot-scope="scope">
                          <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.afterPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                        </template>
                      </el-table-column>
                      <el-table-column prop="startMaintenanceTime" label="开始维修时间" width="180"></el-table-column>
                      <el-table-column prop="repairCompletionTime" label="维修完成时间" width="180"></el-table-column>
                      <el-table-column prop="maintenanceDuration" label="维修时长" min-width="160" sortable="custom"></el-table-column>
                      <el-table-column prop="equipmentState" label="设备状态" width="120">
                        <template slot-scope="scope">
                          <div v-if="scope.row.equipmentState == 'normal'"><el-tag type="success">正常</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'repair'"><el-tag type="warning">维修</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'discard'"><el-tag type="info">报废</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'spare'"><el-tag>备用</el-tag></div>
                          <div v-else-if="scope.row.equipmentState == 'stop'"><el-tag type="danger">停用</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="departmentIdName" label="申请部门" min-width="120" />
                      <el-table-column prop="applicantIdName" label="申请人" width="120"></el-table-column>
                      <el-table-column prop="applicationDate" label="申请日期" width="180" sortable="custom"></el-table-column>
                      <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                        <template slot-scope="scope">
                          <div v-if="scope.row.state == 'toBeMaintain'"><el-tag type="danger">待维修</el-tag></div>
                          <div v-else-if="scope.row.state == 'maintaining'"><el-tag type="warning">正在维修</el-tag></div>
                          <div v-else-if="scope.row.state == 'maintained'"><el-tag type="success">已维修</el-tag></div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                      <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    </JNPF-table>
                    <pagination :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="initData" />
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="维修及时率分析" name="wxjslfx">
              <div class="statistical">
                <div class="new-engine-chart">
                  <div class="wx-container-content has-hover">
                    <chart id="repairline" :option="repairlinetion"></chart>
                  </div>
                  <div class="wx-container-content has-hover">
                    <chart id="maintenanceduration" :option="maintenancedurationtion"></chart>
                  </div>
                  <div class="wx-container-content has-hover">
                    <chart id="trend" :option="trendtion"></chart>
                  </div>
                  <div class="wx-container-content has-hover">
                    1231
                  </div>
                </div>
              </div>
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from "@/views/dailyManagement/deviceReportanaly/components/chart.vue";
import { RepairRequestList, totalRepairNum, repairNum, repairSupplierNum, repairCommentsNum, repairRejectReasonNum } from '@/api/dailyManagement/Maintenance'
import card from "@/views/dailyManagement/deviceReportanaly/components/card.vue";
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  components: { card, chart },
  data() {
    return {
      istable: false,
      isProjectSwitch: '',
      StateList: [
        { label: '待维修', value: 'toBeMaintain' }, { label: '正在维修', value: 'maintaining' }, { label: '已维修', value: 'maintained' }
      ],
      datalistobj: {},
      trendtion: {},
      maintenancedurationtion: {},
      repairlinetion: {},
      total: 0,
      rejectoption: {},
      supplieroption: {},
      dispatchworkoption: {},
      datalistwx: [
        { name: '待派工工单数', unit: '单', id: 'allNum', value: '0' },
        { name: '维修中工单数', unit: '单', id: 'maintainingNum', value: '0' },
        { name: '本月报修工单总数', unit: '单', id: 'mouthNum', value: '0' },
        { name: '维修工单总数', unit: '单', id: 'toBeMaintenanceNum', value: '0' },
      ],
      listLoading: false,
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      listQuery: {},
      activeName: 'wxqkgl',
      listQueryone: {
        reviewComments: '',
        state: '',
        classAttribute: "equipment",
        maintenanceNo: '',
        equipmentIdCode: '',
        equipmentIdName: '',
        applicantIdName: '',
        applicationStartDate: '',
        applicationEndDate: '',
        faultStartTimeStart: '',
        faultStartTimeEnd: '',
        maintenancePersonnel: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time" /* 使用倒序日期作为默认排序 */
        }],
      },
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.istable = true
    this.listQuery = JSON.parse(JSON.stringify(this.listQueryone))
    this.initDatawxqkgl()
  },
  methods: {
    //派工情况概览
    initDatapgqkgl() {
      let obj = {
        classAttribute: "equipment"
      }
      repairSupplierNum(obj).then(res => {
        this.supplieroption = {
          title: {
            text: '供应商维修单数量',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 12
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '1%',
            right: '1%',
            bottom: '15%',
            containLabel: true
          },
          color: ['#0052cc'],
          xAxis: [
            {
              type: 'category',
              data: res.data.map(item => item.totalName),
              axisTick: {
                alignWithLabel: true,
                show: false
              }
            }
          ],
          yAxis: [
            {
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              type: 'value',
              minInterval: 1
            }
          ],
          series: [
            {
              barWidth: '30%',
              label: {
                show: true,
                position: 'top'
              },
              name: '维修单数量',
              type: 'bar',
              data: res.data.map(item => item.totalNum)
            }
          ]
        }
      })
      repairCommentsNum(obj).then(res => {
        this.dispatchworkoption = {
          title: {
            text: '派工审核意见统计',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 12
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            bottom: 10
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: res.data.map(item => {
                return { value: item.totalNum, name: item.totalName }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      })
      repairRejectReasonNum(obj).then(res => {
        this.rejectoption = {
          title: {
            text: '报修单驳回原因统计',
            textStyle: {
              fontWeight: '450',
              fontSize: 14
            },
            top: 12
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            bottom: 10
          },
          series: [
            {
              type: 'pie',
              radius: '50%',
              data: res.data.map(item => {
                return { value: item.totalNum, name: item.totalName }
              }),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      })
      this.initData()
    },
    handleClick({ name }) {
      if (name === 'wxqkgl') {
        this.initDatawxqkgl()
      } else if (name === 'pgqkgl') {
        this.initDatapgqkgl()
      } else {
        this.initDatawxjslfx()
      }
    },
    //维修及时率分析
    initDatawxjslfx() {
      this.repairlinetion = this.maintenancedurationtion = {
        title: {
          text: '不同故障等级的响应时长和维修时长',
          textStyle: {
            fontWeight: '450',
            fontSize: 14
          },
          top: 12
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['故障响应时长（小时）', '维修时长（小时）'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '故障响应时长（小时）',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '维修时长（小时）',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
        ]
      }
      this.trendtion = {
        title: {
          text: '维修及时率趋势',
          textStyle: {
            fontWeight: '450',
            fontSize: 14
          },
          top: 12
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'shadow'
          // },
          // formatter: '{b} : {c}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [1, 2, 3, 4, 5]
          }
        ],
        yAxis: [
          {
            type: 'value',
            max: 100,
            splitNumber: 5,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        color: ['#307deb'],
        series: [
          {
            name: '维修及时率',
            type: 'line',
            label: {
              show: true
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#3883ec' // 0% 处的颜色
                }, {
                  offset: 1, color: '#fff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            emphasis: {
              focus: 'series'
            },
            smooth: true,
            data: [12, 22, 10, 15, 14]
          }
        ]
      }
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    initDatawxqkgl() {
      let obj = {
        classAttribute: "equipment"
      }
      repairNum(obj).then(res => {
        this.datalistobj = res.data
      })
      totalRepairNum(obj).then(res => {
        this.datalistwx.forEach(item => {
          item.value = res.data[item.id]
        })
      })
      this.initData()
    },
    reset() {
      this.listQuery = JSON.parse(JSON.stringify(this.listQueryone))
      this.$refs['dataTable'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      if (this.activeName == 'wxqkgl') {
        this.listQuery.reviewComments = ''
      } else {
        this.listQuery.reviewComments = 'outsourcing'
      }
      this.search()
    },
    search() {
      this.listQuery.pageNum = 1 // 重置页码
      this.initData()
    },
    sortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuery.orderItems[0].asc = order !== "descending"
      this.listQuery.orderItems[0].column = order === null ? "" : newProp
      this.initData()
    },
    getTimes(time) {
      // 转换为式分秒
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt(time / 60 / 60 % 24)
      let m = parseInt(time / 60 % 60)
      let s = parseInt(time % 60)
      return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ? `${m} 分 ${s} 秒` : `${s} 秒`
    },
    //维修情况概览
    initData() {
      Object.keys(this.listQuery).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuery[key]
        this.listQuery[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      if (this.activeName == 'wxqkgl') {
        this.listQuery.reviewComments = ''
      } else {
        this.listQuery.reviewComments = 'outsourcing'
      }
      RepairRequestList(this.listQuery).then(res => {
        this.tableData = res.data.records.map(item => {
          if (item.frontPic) {
            item.frontPicList = item.frontPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          if (item.afterPic) {
            item.afterPicList = item.afterPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          item.waitDuration = this.getTimes(item.waitDuration)
          item.maintenanceDuration = this.getTimes(item.maintenanceDuration)
          return item
        })
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.wx-content {
  min-width: 1080px;
  .container-header {
    font-weight: 400;
    height: 30px;
    padding: 0 5px 5px 0;
    box-sizing: border-box;
    .header-title {
      overflow: hidden;
      padding: 0 5px 5px 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .metric-view {
    -webkit-box-align: center;
    -webkit-box-pack: center;
    align-items: center;
    display: flex;
    height: calc(100% - 40px);
    justify-content: center;
    padding: 0 15px;
    .text-line {
      justify-content: center;
      -webkit-box-flex: 1;
      -webkit-box-align: baseline;
      -webkit-box-pack: start;
      align-items: baseline;
      color: #000;
      display: flex;
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .container-header-l {
    text-align: center;
    font-weight: 400;
    height: 40px;
    line-height: 30px;
    padding: 5px;
    box-sizing: border-box;
  }
}
.statistical {
  .new-engine-chart {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .wx-container-content {
      width: calc(50% - 5px);
      height: 420px;
      margin-bottom: 10px;
    }
  }
  .analysis-content {
    display: flex;
    justify-content: space-between;
    .wx-dash-chart {
      width: calc(33.3% - 10px);
      height: 300px;
    }
    .card-item {
      width: calc(20% - 10px);
      height: 250px;
    }
  }
}
.has-hover:hover {
  box-shadow: 0 6px 14px 0 rgba(84, 48, 132, 0.15) !important;
}
.section {
  min-width: 1080px;
  background-color: #fff;
  border-radius: 3px;
}
.group-container-body {
  background-image: url('../equipmenthome/imgs/tjbjt.png');
  background-size: 100% 100%;
  .dash-rich-text {
    width: 100%;
    height: 100%;
    .rich-text-content {
      word-wrap: break-word;
      background: 0 0;
      height: 100%;
      overflow: auto;
      padding-right: 10px;
      word-break: break-word;
      text-align: center;
      font-weight: bold;
      line-height: 1.6;
      font-size: 28px;
      color: #fff;
    }
  }
}
</style>