<template>
  <div class="JNPF-common-layout">
    <div style="overflow: auto;width: 100%;">
      <div class="group-container-body section">
        <div>
          <div class="dash-container has-hover">
            <div class="dash-rich-text">
              <div class="rich-text-content">工具动态看板</div>
            </div>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px;background-color: #fff;min-width: 1080px;">
        <el-tabs type="border-card" style="height: 100%;" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="工具台账" name="sbtz">
            <div class="table-content">
              <div v-loading="listLoading">
                <el-row :gutter="16">
                  <el-form @submit.native.prevent>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerysbtz.code" placeholder="请输入工具编码" @keyup.enter.native="searchsbtz()" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerysbtz.name" placeholder="请输入工具名称" @keyup.enter.native="searchsbtz()" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-select v-model="listQuerysbtz.state" filterable placeholder="请选择工具状态" clearable style="width: 100%;">
                          <el-option v-for="item in equipmentStateList" :key="item.value" :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchsbtz()">
                          {{ $t('common.search') }}</el-button>
                        <el-button size="mini" icon="el-icon-refresh-right" @click="resetsbtz()">{{ $t('common.reset') }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <div style="height: 979px;" class="JNPF-flex-main">
                  <JNPF-table ref="dataTable" v-if="istable" :data="tableDatasbtz" @sort-change="sortChangesbtz" fixedNO custom-column customKey="JNPFTableKey_753996">
                    <el-table-column prop="code" label="工具编码" min-width="200" sortable="custom" />
                    <el-table-column prop="name" label="工具名称" min-width="200" sortable="custom" />
                    <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                    <el-table-column prop="state" label="工具状态" min-width="140" sortable="custom">
                      <template slot-scope="{row}">
                        <el-tag type="success" disable-transitions v-if="row.state == 'normal'">正常</el-tag>
                        <el-tag type="warning" disable-transitions v-if="row.state == 'repair'">维修</el-tag>
                        <el-tag type="info" disable-transitions v-if="row.state == 'verification'">检定</el-tag>
                        <el-tag disable-transitions v-if="row.state == 'use'">领用</el-tag>
                        <el-tag type="danger" disable-transitions v-if="row.state == 'discard'">报废</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="categoryName" label="分类名称" width="200" sortable="custom" />
                    <el-table-column prop="specModel" label="工具规格" min-width="200" sortable="custom" />
                    <el-table-column prop="drawingNo" label="图号" min-width="200" sortable="custom" />
                    <el-table-column prop="createByName" label="创建人" min-width="200" sortable="custom" />
                    <el-table-column prop="createTime" label="创建时间" min-width="200" sortable="custom" />
                  </JNPF-table>
                  <pagination :total="total" :page.sync="listQuerysbtz.pageNum" :limit.sync="listQuerysbtz.pageSize" @pagination="initequipmentledger" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工具概况" name="sbgk">
            <div class="table-content">
              <div>
                <el-row :gutter="16">
                  <el-form @submit.native.prevent>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerysbgk.usin" placeholder="请输入用途" @keyup.enter.native="searchsbgk()" clearable />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchsbgk()">
                          {{ $t('common.search') }}</el-button>
                        <el-button size="mini" icon="el-icon-refresh-right" @click="resetsbgk()">{{ $t('common.reset') }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <div class="JNPF-common-layout-main JNPF-flex-main">
                  <div class="vux-flexbox container-content vux-flex-row" style="height: 360px;">
                    <div class="left-content">
                      <div class="react-grid-item dash-container has-hover" v-for="item in datalist" :key="item.id">
                        <div class="container-header-l">{{item.name}}</div>
                        <div class="metric-view">
                          <div class="text-line">
                            <span style="font-size:34px;margin-right: 5px;">{{item.value}}</span>
                            <span>{{item.unit}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="right-content JNPF-flex-main dash-container has-hover">
                      <div class="container-header text">
                        <div class="header-title">工具状态分布</div>
                      </div>
                      <div class="new-engine-chart">
                        <div id="equipmentstatus" :option="option" style="width: 100%; height: 100%;"></div>
                      </div>
                    </div>
                  </div>
                  <div class="vux-flexbox cssTransforms vux-flex-row" v-loading="chartlistLoading">
                    <div class="dash-container has-hover" v-for="item in datasetList" :key="item.id">
                      <div class="container-header text">
                        <div class="header-title">{{item.name}}</div>
                      </div>
                      <div class="new-engine-chart">
                        <chart :id="item.id" :option="item.option"></chart>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="检定分布" name="djfb">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="vux-flexbox container-content vux-flex-row">
                <div class="left-content-dj">
                  <div class="react-grid-item-dj dash-container has-hover" v-for="item in datalistdj" :key="item.id">
                    <div class="container-header-l">{{item.name}}</div>
                    <div class="metric-view">
                      <div class="text-line">
                        <span style="font-size:34px;margin-right: 5px;">{{item.value}}</span>
                        <span>{{item.unit}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right-content-dj JNPF-flex-main dash-container has-hover">
                  <div class="new-engine-chart">
                    <div id="Inspectionfrequency" :option="Inspectionfrequencyoption" style="width: 100%; height: 100%;"></div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 15px;">
                <el-row :gutter="16">
                  <el-form @submit.native.prevent>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerydjfb.verificationAgency" placeholder="请输入检定机构" clearable @keyup.enter.native="searchdjfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerydjfb.actualMaintenanceIdText" placeholder="请输入实际执行人" clearable @keyup.enter.native="searchdjfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchdjfb()">
                          {{ $t('common.search') }}</el-button>
                        <el-button size="mini" icon="el-icon-refresh-right" @click="resetdjfb()">{{ $t('common.reset') }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
              </div>
              <div style="height: 644px;" class="JNPF-flex-main">
                <JNPF-table ref="dataTabledjfb" v-loading="listLoadingdjfb" :data="tableDatadjfb" @sort-change="sortChangedjfb" fixedNO custom-column customKey="JNPFTableKey_437418">
                  <el-table-column prop="verificationAgency" label="检定机构" width="200" sortable="custom" />
                  <el-table-column prop="departmentIdText" label="计划执行部门" width="150" />
                  <el-table-column prop="maintainerIdText" label="计划执行人" width="120"></el-table-column>
                  <el-table-column prop="planMaintenanceDate" label="计划检定日期" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="actualDepartmentIdText" label="实际执行部门" width="150" />
                  <el-table-column prop="actualMaintenanceIdText" label="实际执行人" width="120"></el-table-column>
                  <el-table-column prop="actualMaintenanceDate" label="实际检定日期" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                  <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                </JNPF-table>
                <pagination :total="totaldjfb" :page.sync="listQuerydjfb.pageNum" :limit.sync="listQuerydjfb.pageSize" @pagination="initDatadjfb" />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="维修分布" name="wxfb">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="vux-flexbox container-content vux-flex-row">
                <div class="left-content-dj">
                  <div class="react-grid-item-dj dash-container has-hover" v-for="(item,index) in datalistwx" :key="index">
                    <div class="container-header-l">{{item.name}}</div>
                    <div class="metric-view">
                      <div class="text-line">
                        <span style="font-size:34px;margin-right: 5px;">{{item.value}}</span>
                        <span>{{item.unit}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right-content-dj JNPF-flex-main dash-container has-hover" v-loading="listLoadingwxfbcl">
                  <div class="container-header text">
                    <div class="header-title">处理中工单明细</div>
                  </div>
                  <div style="height: 320px;padding: 0 10px 10px 10px;" class="JNPF-flex-main">
                    <JNPF-table v-if="istable" :data="tableDatawxfbcl" @sort-change="sortChangewxfbcl" fixedNO custom-column customKey="JNPFTableKey_482384">
                      <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
                      </el-table-column>
                      <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
                      <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom"></el-table-column>
                      <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                      <el-table-column prop="usin" label="用途" min-width="140" />
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
                      <el-table-column prop="equipmentState" label="工具状态" width="120">
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
                    <pagination :total="totalwxfb" :page.sync="listQuerywxfb.pageNum" :limit.sync="listQuerywxfb.pageSize" @pagination="initDatawxfb" />
                  </div>
                </div>
              </div>
              <div style="margin-top: 15px;">
                <el-row :gutter="16">
                  <el-form @submit.native.prevent>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerywxfb.maintenanceNo" placeholder="请输入维修单号" clearable @keydown.enter.native="searchwxfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerywxfb.equipmentIdCode" placeholder="请输入工具编码" clearable @keydown.enter.native="searchwxfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerywxfb.equipmentIdName" placeholder="请输入工具名称" clearable @keydown.enter.native="searchwxfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchwxfb()">
                          {{ $t('common.search') }}</el-button>
                        <el-button size="mini" icon="el-icon-refresh-right" @click="resetwxfb()">{{ $t('common.reset') }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
              </div>
              <div style="height: 644px;" class="JNPF-flex-main" v-loading="listLoadingwxfb">
                <JNPF-table v-if="istable" ref="dataTablewxfb" :data="tableDatawxfb" @sort-change="sortChangewxfb" fixedNO custom-column customKey="JNPFTableKey_928707">
                  <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
                  <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom"></el-table-column>
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                  <el-table-column prop="usin" label="用途" min-width="140" />
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
                  <el-table-column prop="equipmentState" label="工具状态" width="120">
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
                <pagination :total="totalwxfb" :page.sync="listQuerywxfb.pageNum" :limit.sync="listQuerywxfb.pageSize" @pagination="initDatawxfb" />
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="保养分布" name="byfb">
            <div class="JNPF-common-layout-main JNPF-flex-main">
              <div class="vux-flexbox container-content vux-flex-row" style="height: 168px;">
                <div class="react-grid-item-by dash-container has-hover" v-for="item in datalistby" :key="item.id">
                  <div class="container-header-l">{{item.name}}</div>
                  <div class="metric-view">
                    <div class="text-line">
                      <span style="font-size:34px;margin-right: 5px;">{{item.value}}</span>
                      <span>{{item.unit}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style="margin-top: 15px;">
                <el-row :gutter="16">
                  <el-form @submit.native.prevent>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerybyfb.equipmentIdCode" placeholder="请输入工具编码" clearable @keyup.enter.native="searchbyfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerybyfb.equipmentIdName" placeholder="请输入工具名称" clearable @keyup.enter.native="searchbyfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-input v-model="listQuerybyfb.actualMaintenanceIdText" placeholder="请输入实际保养人" clearable @keyup.enter.native="searchbyfb()" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchbyfb()">
                          {{ $t('common.search') }}</el-button>
                        <el-button size="mini" icon="el-icon-refresh-right" @click="resetbyfb()">{{ $t('common.reset') }}
                        </el-button>
                      </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
              </div>
              <div style="height: 796px;" class="JNPF-flex-main" v-loading="listLoadingbyfb">
                <JNPF-table ref="dataTablebyfb" v-if="istable" :data="tableDatabyfb" @sort-change="sortChangebyfb" fixedNO custom-column customKey="JNPFTableKey_512598">
                  <el-table-column prop="maintenanceTaskIdText" label="任务名称" min-width="180" />
                  <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" />
                  <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                  <el-table-column prop="usin" label="用途" min-width="140" />
                  <el-table-column prop="level" label="保养等级" width="140" />
                  <el-table-column prop="cycle" label="周期" width="90" />
                  <el-table-column prop="unit" label="单位" width="90" />
                  <el-table-column prop="departmentIdText" label="计划保养部门" min-width="150" />
                  <el-table-column prop="maintainerIdText" label="计划保养人" width="120"></el-table-column>
                  <el-table-column prop="planMaintenanceDate" label="计划保养日期" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="actualDepartmentIdText" label="实际保养部门" min-width="150" />
                  <el-table-column prop="actualMaintenanceIdText" label="实际保养人" width="120"></el-table-column>
                  <el-table-column prop="actualMaintenanceDate" label="实际保养日期" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="picList" label="保养拍照" min-width="160">
                    <template slot-scope="scope">
                      <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.picList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cycleType" label="周期类型" width="120" sortable="custom" fixed="right" align="center">
                    <template slot-scope="scope">
                      <div v-if="scope.row.cycleType == 'cycle'"><el-tag type="success">周期</el-tag></div>
                      <div v-else-if="scope.row.cycleType == 'disposable'">
                        <el-tag type="success">一次</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                </JNPF-table>
                <pagination :total="totalbyfb" :page.sync="listQuerybyfb.pageNum" :limit.sync="listQuerybyfb.pageSize" @pagination="initDatabyfb" />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { equMaintenanceList, RepairRequestList, VerificationrecordsList } from '@/api/dailyManagement/Maintenance'
import { getEquEquipmentList } from '@/api/basicData/index'
import { getequMountedPlaces, gettotalOverview, gettotalEquStats, getequReporttotalNum, getdailyInspectionNum, getdailyInspectionMonthTotal, gettotalMaintenance, getTotalEquipmentVO } from "@/api/basicData/materialSettings";
import chart from "@/views/dailyManagement/deviceReportanaly/components/chart.vue";
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  name:'toolDynamics',
  mixins: [getProjectList],
  components: { chart },
  data() {
    return {
      istable: false,
      isProjectSwitch: '',
      tableDatawxfbcl: [],
      listLoadingwxfbcl: false,
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      totalbyfb: 0,
      listLoadingbyfb: false,
      tableDatabyfb: [],
      listQuerybyfb: {},
      listQuery5: {
        projectId: '',
        classAttribute: "tool",
        recordType: 'maintenance',
        equipmentIdCode: '',
        equipmentIdName: '',
        actualMaintenanceIdText: '',
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
      totalwxfb: 0,
      listLoadingwxfb: false,
      tableDatawxfb: [],
      listQuerywxfbcl: {
        projectId: '',
        state: 'maintaining',
        classAttribute: "tool",
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
      listQuerywxfb: {},
      listQuery4: {
        projectId: '',
        state: 'maintained',
        classAttribute: "tool",
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
      totaldjfb: 0,
      listLoadingdjfb: false,
      tableDatadjfb: [],
      listQuerydjfb: {},
      listQuery3: {
        verificationAgency: '',
        actualMaintenanceIdText: '',
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
      listQuerysbtz: {},
      listQuery1: {
        name: '',
        code: '',
        state: '',
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "create_time"
        }],
        pageNum: 1,
        pageSize: 20,
        classAttribute: "tool"
      },
      equipmentStateList: [
        {
          value: "normal",
          label: "正常"
        },
        {
          value: "verification",
          label: "检定"
        },
        {
          value: "repair",
          label: "维修"
        },
        {
          value: "use",
          label: "领用"
        },
        {
          value: "discard",
          label: "报废"
        }
      ],
      activeName: 'sbtz',
      total: 0,
      listLoading: false,
      tableData: [],
      tableDatasbtz: [],
      datalist: [
        { name: '累计检定次数', unit: '次', id: 'inspectionNum', value: '0' },
        { name: '累计报废数量', unit: '个', id: 'scrappingNum', value: '0' },
        { name: '累计报修次数', unit: '次', id: 'repairNum', value: '0' },
        { name: '累计保养次数', unit: '次', id: 'maintenanceNum', value: '0' }
      ],
      datalistdj: [
        { name: '今日未检定', unit: '次', id: 'inspectionNum', value: '0' },
        { name: '今日已检定', unit: '次', id: 'scrappingNum', value: '0' },
      ],
      datalistwx: [
        { name: '已完成维修数', unit: '单', value: '0' },
        { name: '处理中工单数', unit: '单', value: '0' },
      ],
      datalistby: [
        { name: '今日待完成保养任务', unit: '次', id: 'dailyPlanNum', value: '0' },
        { name: '今日已完成保养任务', unit: '次', id: 'dailyMaintenanceNum', value: '0' },
        { name: '本月已完成保养任务', unit: '次', id: 'mouthMaintenanceNum', value: '0' },
        { name: '本月待完成保养任务', unit: '次', id: 'mouthPlanNum', value: '0' },
      ],
      loadingfactoryFloorid: false,
      chartlistLoading: false,
      leftlistLoading: false,
      rightlistLoading: false,
      deliveryDateArr: [],
      mountedPlacesList: [],
      factoryFloorList: [],
      listQuerysbgk: {},
      listQuery2: {
        pageNum: 1,
        pageSize: 20,
        usin: '',
        maintenanceType: '',
        classAttribute: "tool"
      },
      datasetList: [
        { name: '正常工具数量分布', id: 'inspectionquipment', option: {} },
        { name: '维修中工具数量分布', id: 'maintenanceequipment', option: {} }
      ],
      chartInstance: null,
      timeout: null,
      option: {},
      Inspectionfrequencyoption: {}
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  watch: {
    activeName: {
      handler(newOption) {
        if (newOption == 'sbtz') {
          this.initequipmentledger()
        } else if (newOption == 'sbgk') {
          this.initDatasbgk()
        } else if (newOption == 'djfb') {
          this.initDatadjfb()
        } else if (newOption == 'wxfb') {
          this.initDatawxfb()
        } else {
          this.initDatabyfb()
        }
      },
      deep: true
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    this.istable = true
    this.listQuerysbtz = JSON.parse(JSON.stringify(this.listQuery1))
    this.listQuerysbgk = JSON.parse(JSON.stringify(this.listQuery2))
    this.listQuerydjfb = JSON.parse(JSON.stringify(this.listQuery3))
    this.listQuerywxfb = JSON.parse(JSON.stringify(this.listQuery4))
    this.listQuerybyfb = JSON.parse(JSON.stringify(this.listQuery5))
    this.initequipmentledger()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    //工具台账
    initequipmentledger() {
      Object.keys(this.listQuerysbtz).forEach(key => {
        let item = this.listQuerysbtz[key]
        this.listQuerysbtz[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoading = true
      this.listQuerysbtz.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      getEquEquipmentList(this.listQuerysbtz).then(res => {
        this.tableDatasbtz = res.data.records
        this.total = res.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    searchsbtz() {
      this.listQuerysbtz.pageNum = 1
      this.initequipmentledger()
    },
    resetsbtz() {
      this.$refs['dataTable'].$refs.JNPFTable.clearSort()
      this.listQuerysbtz = JSON.parse(JSON.stringify(this.listQuery1))
      this.searchsbtz()
    },
    sortChangesbtz({ prop, order }) {
      let newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      if (newProp === 'create_name') { newProp = 'create_by' }
      this.listQuerysbtz.orderItems[0].asc = order === "ascending"
      this.listQuerysbtz.orderItems[0].column = order === null ? "" : newProp
      this.initequipmentledger()
    },
    //工具概况
    resetsbgk() {
      this.listQuerysbgk = JSON.parse(JSON.stringify(this.listQuery2))
      this.searchsbgk()
    },
    searchsbgk() {
      this.initDatasbgk()
    },
    async initDatasbgk() {
      this.chartInstance = await this.$echarts.init(document.getElementById('equipmentstatus'));
      if (!this.chartInstance) return
      this.leftlistLoading = true
      gettotalOverview(this.listQuery2).then(res => {
        this.datalist.forEach(item => {
          item.value = res.data[item.id]
        })
        this.leftlistLoading = false
      }).catch(() => {
        this.leftlistLoading = false
      })
      this.rightlistLoading = true
      gettotalEquStats(this.listQuerysbgk).then(res => {
        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            top: 'middle',
            left: 'right'
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '80%'],
              avoidLabelOverlap: false,
              label: {
                formatter: '{c} ({d}%)'
              },
              data: res.data.map(item => {
                return { value: item.totalNum, name: item.totalName }
              })
            }
          ]
        }
        this.chartInstance.setOption(this.option);
        this.chartInstance.resize()
        this.rightlistLoading = false
      }).catch(() => {
        this.rightlistLoading = false
      })
      this.chartlistLoading = true
      this.datasetList.forEach(item => {
        if (item.id == 'inspectionquipment') {
          this.listQuerysbgk.maintenanceType = 'normal'
        } else {
          this.listQuerysbgk.maintenanceType = 'repair'
        }
        const querylist = { ...this.listQuerysbgk }
        getequReporttotalNum(querylist).then(res => {
          item.option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              top: '10%',
              left: '1%',
              right: '1%',
              bottom: '15%',
              containLabel: true
            },
            color: ['#0052cc'],
            legend: {
              data: ['工具数量'],
              bottom: 10
            },
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
                name: '工具数量',
                type: 'bar',
                data: res.data.map(item => item.totalNum)
              }
            ]
          }
          this.chartlistLoading = false
        }).catch(() => {
          this.chartlistLoading = false
        })
      })
    },
    //检定分布
    async initDatadjfb() {
      let obj = {
        classAttribute: "tool"
      }
      getdailyInspectionNum(obj).then(res => {
        res.data.forEach(item => {
          if (item.totalName == 'unexecuted') {
            this.$set(this.datalistdj[0], 'value', item.totalNum)
          } else {
            this.$set(this.datalistdj[1], 'value', item.totalNum)
          }
        })
      })
      this.Inspectionfrequency = await this.$echarts.init(document.getElementById('Inspectionfrequency'));
      if (!this.Inspectionfrequency) return
      getdailyInspectionMonthTotal(obj).then(res => {
        this.Inspectionfrequencyoption = {
          title: {
            text: '检定次数趋势',
            textStyle: {
              fontWeight: 'bold'
            },
            top: 12
          },
          tooltip: {
            trigger: 'axis'
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
              data: res.data.map(item => item.totalName)
            }
          ],
          yAxis: [
            {
              type: 'value',
              minInterval: 1,
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              }
            }
          ],
          color: ['#307deb'],
          series: [
            {
              name: '检定次数',
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
              data: res.data.map(item => item.totalNum)
            }
          ]
        };
        this.Inspectionfrequency.setOption(this.Inspectionfrequencyoption)
        this.Inspectionfrequency.resize()
      })
      this.getlistdatadjfb()
    },
    resetdjfb() {
      this.$refs['dataTabledjfb'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.searchdjfb()
    },
    searchdjfb() {
      this.listQuerydjfb.pageNum = 1 // 重置页码
      this.getlistdatadjfb()
    },
    sortChangedjfb({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuerydjfb.orderItems[0].asc = order !== "descending"
      this.listQuerydjfb.orderItems[0].column = order === null ? "" : newProp
      this.getlistdatadjfb()
    },
    getlistdatadjfb() {
      Object.keys(this.listQuerydjfb).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuerydjfb[key]
        this.listQuerydjfb[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoadingdjfb = true
      VerificationrecordsList(this.listQuerydjfb).then(res => {
        this.tableDatadjfb = res.data.records
        this.totaldjfb = res.data.total
        this.listLoadingdjfb = false
      }).catch(() => {
        this.listLoadingdjfb = false
      })
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    //维修分布
    async initDatawxfb() {
      this.getlistdatawxfbcl()
      this.getlistdatawxfb()
    },
    getlistdatawxfbcl() {
      this.listLoadingwxfbcl = true
      this.listQuerywxfbcl.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      RepairRequestList(this.listQuerywxfbcl).then(res => {
        this.tableDatawxfbcl = res.data.records.map(item => {
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
        this.totalwxfbcl = res.data.total
        this.$set(this.datalistwx[1], 'value', res.data.total)
        this.listLoadingwxfbcl = false
      }).catch(() => {
        this.listLoadingwxfbcl = false
      })
    },
    sortChangewxfbcl({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuerywxfbcl.orderItems[0].asc = order !== "descending"
      this.listQuerywxfbcl.orderItems[0].column = order === null ? "" : newProp
      this.getlistdatawxfbcl()
    },
    getlistdatawxfb() {
      Object.keys(this.listQuerywxfb).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuerywxfb[key]
        this.listQuerywxfb[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoadingwxfb = true
      this.listQuerywxfb.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      RepairRequestList(this.listQuerywxfb).then(res => {
        this.tableDatawxfb = res.data.records.map(item => {
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
        this.totalwxfb = res.data.total
        this.$set(this.datalistwx[0], 'value', res.data.total)
        this.listLoadingwxfb = false
      }).catch(() => {
        this.listLoadingwxfb = false
      })
    },
    searchwxfb() {
      this.listQuerywxfb.pageNum = 1 // 重置页码
      this.getlistdatawxfb()
    },
    sortChangewxfb({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuerywxfb.orderItems[0].asc = order !== "descending"
      this.listQuerywxfb.orderItems[0].column = order === null ? "" : newProp
      this.getlistdatawxfb()
    },
    resetwxfb() {
      this.$refs['dataTablewxfb'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuerywxfb = JSON.parse(JSON.stringify(this.listQuery4))
      this.getlistdatawxfb()
    },
    getTimes(time) {
      // 转换为式分秒
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt(time / 60 / 60 % 24)
      let m = parseInt(time / 60 % 60)
      let s = parseInt(time % 60)
      return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ? `${m} 分 ${s} 秒` : `${s} 秒`
    },
    //保养分布
    async initDatabyfb() {
      let obj = {
        classAttribute: "tool"
      }
      gettotalMaintenance(obj).then(res => {
        this.datalistby.forEach(item => {
          item.value = res.data[item.id]
        })
      })
      this.getlistdatabyfb()
    },
    getlistdatabyfb() {
      Object.keys(this.listQuerybyfb).forEach(key => { // 清除搜索条件两端空格
        let item = this.listQuerybyfb[key]
        this.listQuerybyfb[key] = typeof item === 'string' ? item.trim() : item
      })
      this.listLoadingbyfb = true
      this.listQuerybyfb.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      equMaintenanceList(this.listQuerybyfb).then(res => {
        this.tableDatabyfb = res.data.records.map(item => {
          if (item.picList && item.picList.length) item.picList = item.picList.map(o => { return JSON.parse(`{${o}}`) })
          return item
        })
        this.totalbyfb = res.data.total
        this.listLoadingbyfb = false
      }).catch(() => {
        this.listLoadingbyfb = false
      })
    },
    searchbyfb() {
      this.listQuerybyfb.pageNum = 1 // 重置页码
      this.getlistdatabyfb()
    },
    sortChangebyfb({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.listQuerybyfb.orderItems[0].asc = order !== "descending"
      this.listQuerybyfb.orderItems[0].column = order === null ? "" : newProp
      this.getlistdatabyfb()
    },
    resetbyfb() {
      this.$refs['dataTablebyfb'].$refs.JNPFTable.clearSort() // 清除排序箭头高亮
      this.listQuerybyfb = JSON.parse(JSON.stringify(this.listQuery4))
      this.getlistdatabyfb()
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs--border-card > .el-tabs__content {
  height: calc(100% - 38px);
  .el-tab-pane {
    height: 100%;
  }
}
.dash-container.has-hover:hover {
  box-shadow: 0 6px 14px 0 rgba(84, 48, 132, 0.15) !important;
}
.group-container-body {
  & > div {
    height: 65px;
    width: 100%;
    background-image: url('~@/views/dailyManagement/deviceReportanaly/equipmenthome/imgs/tjbjt.png');
    background-size: 100% 100%;
  }
  .dash-rich-text {
    width: 100%;
    height: 100%;
    padding: 10px 0 10px 10px;
    // background-color: #8b2f2f;
    .rich-text-content {
      word-wrap: break-word;
      background: 0 0;
      height: 100%;
      overflow: auto;
      padding-right: 10px;
      word-break: break-word;
      text-align: center;
      line-height: 1.5;
      font-weight: bold;
      font-size: 28px;
      color: #fff;
    }
  }
  .speedy-entry-wrapper {
    height: 100%;
    overflow: hidden;
    padding: 8px 10px;
    width: 100%;
    .entry-lists {
      display: flex;
      flex-wrap: wrap;
      li {
        border-radius: 2px;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        list-style-type: none;
        width: calc(50% - 12px);
        margin: 4px 6px;
        .node-wrapper {
          -webkit-box-align: center;
          align-items: center;
          border: 1px solid transparent;
          border-radius: 4px;
          display: flex;
          height: 46px;
          overflow: hidden;
          padding: 10px 12px;
        }
        .node-wrapper:hover {
          background-color: #f5f6f8;
        }
      }
    }
  }
}
.container-content {
  // padding: 5px;
  height: 320px;
  .left-content {
    display: flex;
    flex-wrap: wrap;
    width: 40%;
  }
  .left-content-dj {
    width: 20%;
  }
  .right-content {
    margin-right: 5px;
    width: 60%;
    height: 320px;
  }
  .right-content-dj {
    margin-right: 5px;
    width: calc(80% - 5px);
    height: 320px;
  }
  .react-grid-item {
    // margin: 0 5px;
    height: 155px;
    width: calc(50% - 10px);
  }
  .react-grid-item-dj {
    // margin: 0 5px;
    height: 155px;
    width: calc(100% - 10px);
  }
  .react-grid-item-by {
    height: 155px;
    width: calc(25% - 8px);
  }
  .react-grid-item-by + .react-grid-item-by {
    margin-left: 10px;
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
}
.container-header-l {
  text-align: center;
  font-weight: 400;
  height: 40px;
  line-height: 30px;
  padding: 5px;
  box-sizing: border-box;
}
.container-header {
  font-weight: 400;
  height: 40px;
  line-height: 30px;
  padding: 5px;
  box-sizing: border-box;
  .header-title {
    overflow: hidden;
    padding: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.new-engine-chart {
  flex: 1;
  padding: 0 10px;
}
.section {
  min-width: 1080px;
  background-color: #fff;
  border-radius: 3px;
}
.cssTransforms {
  padding: 0 10px;
  min-width: 1080px;
  .dash-container {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 3px;
    height: 609px;
    width: calc(50% - 5px);
    &:nth-child(even) {
      margin-left: 10px;
    }
    display: flex;
    flex-direction: column;
  }
}
</style>