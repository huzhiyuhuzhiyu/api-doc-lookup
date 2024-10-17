<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <el-page-header @back="goBack" content="查看履历" />
        <div class="options">
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" ref="main" v-loading="formLoading">
        <el-tabs v-model="activeName" class=".el-table">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="工具信息" name="basicInfo">
              <div class="stoclInfo" ref="stoclInfo">
                <div class="maintenancetitle">{{dataForm.name}}</div>
                <el-descriptions :column="1" label-class-name="maintenancelabel" content-class-name="maintenancelabel">
                  <el-descriptions-item label="创建时间">{{dataForm.createTime}}</el-descriptions-item>
                  <el-descriptions-item label="创建人">{{dataForm.createByName}}</el-descriptions-item>
                </el-descriptions>
                <img class="equipmentstatus" v-if="dataForm.state=='normal'" src="@/assets/images/zhengchang.png" alt="">
                <img class="equipmentstatus" v-if="dataForm.state=='repair'" src="@/assets/images/weixiuzhong.png" alt="">
                <img class="equipmentstatus" v-if="dataForm.state=='discard'" src="@/assets/images/baofei.png" alt="">
              </div>
              <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick"> -->
              <div style="padding-left: 5px;border-bottom: 1px solid #dcdfe6;" ref="radio">
                <el-radio-group v-model="activeName">
                  <el-radio-button label="sbxxinfo">工具信息</el-radio-button>
                  <el-radio-button label="lyghinfo">领用归还信息</el-radio-button>
                  <el-radio-button label="wxjlinfo">维修记录</el-radio-button>
                  <el-radio-button label="byrwinfo">保养任务</el-radio-button>
                  <el-radio-button label="byjlinfo">保养记录</el-radio-button>
                  <el-radio-button label="djrwinfo">检定任务</el-radio-button>
                  <el-radio-button label="djjlinfo">检定记录</el-radio-button>
                </el-radio-group>
              </div>
              <div style="padding: 5px;">
                <div v-if="activeName=='sbxxinfo'">
                  <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top" v-loading="dataFormLoading">
                    <el-row :gutter="20" class="custom-row">
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="工具类型" prop="categoryName" ref="comList1">
                          <ComSelect-list :isdisabled="true" v-model="dataForm.categoryName" placeholder="请选择工具类型" auth :title="'选择工具类型'" :method="getCategoryTrees" :requestObj="requestObj" :paramsObj="{}" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="工具名称" prop="name">
                          <el-input v-model="dataForm.name" placeholder="请输入工具名称" maxlength="20" :disabled="true" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="工具编码" prop="code">
                          <el-input v-model="dataForm.code" placeholder="请输入工具编码" maxlength="20" :disabled="true" />
                        </el-form-item>
                      </el-col>

                      <el-col :sm="12" :xs="24">
                        <el-form-item label="工具规格" prop="specModel">
                          <el-input maxlength="50" v-model="dataForm.specModel" placeholder="请输入工具规格" :disabled="true" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="图号" prop="drawingNo">
                          <el-input v-model="dataForm.drawingNo" placeholder="请输入图号" maxlength="50" :disabled="true">
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="长" prop="equLong">
                          <el-input v-model="dataForm.equLong" placeholder="请输入长" :disabled="true">
                            <template #append>（cm）</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="宽" prop="width">
                          <el-input v-model="dataForm.width" placeholder="请输入宽" :disabled="true">
                            <template #append>（cm）</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="高" prop="height">
                          <el-input v-model="dataForm.height" placeholder="请输入高" :disabled="true">
                            <template #append>（cm）</template>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="体积" prop="unitVolume">
                          <el-input v-model="dataForm.unitVolume" placeholder="请输入体积" :disabled="true" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="用途" prop="usin">
                          <el-input maxlength="200" v-model="dataForm.usin" placeholder="请输入用途" :disabled="true" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="使用人" prop="userId">
                          <user-select v-model="dataForm.userId" placeholder="请选择所属人员" clearable style="width: 100%;" :disabled="true" @change="getuserDepartment">
                          </user-select>

                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="8">
                        <el-form-item label="使用部门" prop="userDepartmentName">
                          <el-input v-model="dataForm.userDepartmentName" readonly placeholder="请输入使用部门" :disabled="true" />
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="工具状态" prop="state">
                          <el-select v-model="dataForm.state" placeholder="请选择工具状态" clearable :disabled="true" style="width: 100%;">
                            <el-option v-for="( item, index ) in  equipmentStatusList " :key="index" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :sm="12" :xs="24">
                        <el-form-item label="备注" prop="remark">
                          <el-input maxlength="200" class="shuru" v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2" :disabled="true" style="width: 100%;" />
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
                <div v-if="activeName=='lyghinfo'">领用归还信息</div>
                <div v-if="activeName=='wxjlinfo'">
                  <JNPF-table ref="wxjldataTable" v-loading="wxjllistLoading" @sort-change="wxjlsortChange" :data="wxjldataTable" fixedNO custom-column :height=height>
                    <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
                    <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="factoryFloor" label="使用车间" min-width="140" sortable="custom" />
                    <el-table-column prop="mountedPlaces" label="安装地点" min-width="140" sortable="custom" />
                    <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
                      <template slot-scope="scope">
                        <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                      </template>
                    </el-table-column>
                    <el-table-column prop="faultStartTime" label="故障开始时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="reviewComments" label="审核意见" width="120" sortable="custom">
                      <template slot-scope="scope">
                        <div v-if="scope.row.reviewComments == 'immediately'"><el-tag type="danger">立即维修</el-tag></div>
                        <div v-else-if="scope.row.reviewComments == 'reject'"><el-tag type="warning">驳回</el-tag></div>
                        <div v-else-if="scope.row.reviewComments == 'outsourcing'"><el-tag>转委外</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="rejectReason" label="驳回理由" min-width="160" sortable="custom">
                      <template slot-scope="scope">
                        <div><el-tag type="success" v-if="scope.row.rejectReason">{{scope.row.rejectReason}}</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="degree" label="紧急程度" width="120" sortable="custom">
                      <template slot-scope="scope">
                        <div v-if="scope.row.degree == '1'"><el-tag type="danger">特别紧急</el-tag></div>
                        <div v-else-if="scope.row.degree == '2'"><el-tag type="warning">紧急</el-tag></div>
                        <div v-else-if="scope.row.degree == '3'"><el-tag>一般</el-tag></div>
                        <div v-else-if="scope.row.degree == '4'"><el-tag type="success">不急</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="maintenancePersonnelName" label="维修负责人" width="140" sortable="custom"></el-table-column>
                    <el-table-column prop="waitDuration" label="故障响应时长(小时)" min-width="200" sortable="custom" />
                    <el-table-column prop="sparePartsFlag" label="是否更换备件" width="160" sortable="custom">
                      <template slot-scope="scope">
                        <div v-if="scope.row.sparePartsFlag == '0'"><el-tag type="warning">否</el-tag></div>
                        <div v-else-if="scope.row.sparePartsFlag == '1'"><el-tag type="success">是</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="reason" label="故障原因" min-width="160" sortable="custom" />
                    <el-table-column prop="solutionMeasures" label="解决措施" min-width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="afterPicList" label="维修完成拍照" min-width="160">
                      <template slot-scope="scope">
                        <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.afterPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                      </template>
                    </el-table-column>
                    <el-table-column prop="startMaintenanceTime" label="开始维修时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="repairCompletionTime" label="维修完成时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="maintenanceDuration" label="维修时长" min-width="160" sortable="custom"></el-table-column>
                    <el-table-column prop="equipmentState" label="工具状态" width="120" sortable="custom">
                      <template slot-scope="scope">
                        <div v-if="scope.row.equipmentState == 'normal'"><el-tag type="success">正常</el-tag></div>
                        <div v-else-if="scope.row.equipmentState == 'repair'"><el-tag type="warning">维修</el-tag></div>
                        <div v-else-if="scope.row.equipmentState == 'discard'"><el-tag type="info">报废</el-tag></div>
                        <div v-else-if="scope.row.equipmentState == 'spare'"><el-tag>备用</el-tag></div>
                        <div v-else-if="scope.row.equipmentState == 'stop'"><el-tag type="danger">停用</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="departmentIdName" label="申请部门" min-width="120" sortable="custom" />
                    <el-table-column prop="applicantIdName" label="申请人" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="applicationDate" label="申请日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.state == 'toBeMaintain'"><el-tag type="danger">待维修</el-tag></div>
                        <div v-else-if="scope.row.state == 'maintaining'"><el-tag type="warning">正在维修</el-tag></div>
                        <div v-else-if="scope.row.state == 'maintained'"><el-tag type="success">已维修</el-tag></div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <pagination :total="total" :page.sync="wxjlorderForm.pageNum" :limit.sync="wxjlorderForm.pageSize" @pagination="getwxjlinfo" />
                </div>
                <div v-if="activeName=='byrwinfo'">
                  <JNPF-table ref="byrwdataTable" v-loading="byrwlistLoading" :data="byrwdataTable" @sort-change="byrwsortChange" fixedNO custom-column :height=height>
                    <el-table-column prop="name" label="任务名称" min-width="200" fixed="left" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" fixed="left" sortable="custom" />
                    <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" fixed="left" sortable="custom"></el-table-column>
                    <el-table-column prop="level" label="保养等级" min-width="140" sortable="custom"></el-table-column>
                    <el-table-column prop="cycle" label="周期" width="90" sortable="custom"></el-table-column>
                    <el-table-column prop="unit" label="单位" width="90" sortable="custom"></el-table-column>
                    <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                        <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
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
                    <el-table-column prop="departmentIdName" label="计划保养部门" min-width="150" sortable="custom" />
                    <el-table-column prop="maintainerIdName" label="计划保养人" width="140" sortable="custom"></el-table-column>
                    <el-table-column prop="nextMaintenanceTime" label="计划保养日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="300"></el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <pagination :total="total" :page.sync="byrworderForm.pageNum" :limit.sync="byrworderForm.pageSize" @pagination="getbyrwinfo" />
                </div>
                <div v-if="activeName=='byjlinfo'">
                  <JNPF-table ref="byjldataTable" v-loading="byjllistLoading" :data="byjldataTable" @sort-change="byjlsortChange" fixedNO custom-column :height=height>
                    <el-table-column prop="maintenanceTaskIdText" label="任务名称" min-width="180" sortable="custom" />
                    <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
                    <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom" />
                    <el-table-column prop="factoryFloor" label="使用车间" min-width="140" sortable="custom" />
                    <el-table-column prop="mountedPlaces" label="安装地点" min-width="140" sortable="custom" />
                    <el-table-column prop="level" label="保养等级" width="140" sortable="custom" />
                    <el-table-column prop="cycle" label="周期" width="90" sortable="custom" />
                    <el-table-column prop="unit" label="单位" width="90" sortable="custom" />
                    <el-table-column prop="departmentIdText" label="计划保养部门" min-width="150" sortable="custom" />
                    <el-table-column prop="maintainerIdText" label="计划保养人" width="140" sortable="custom"></el-table-column>
                    <el-table-column prop="planMaintenanceDate" label="计划保养日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="actualDepartmentIdText" label="实际保养部门" min-width="150" sortable="custom" />
                    <el-table-column prop="actualMaintenanceIdText" label="实际保养人" width="140" sortable="custom"></el-table-column>
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
                    <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <pagination :total="total" :page.sync="byjlorderForm.pageNum" :limit.sync="byjlorderForm.pageSize" @pagination="getbyjlinfo" />
                </div>
                <div v-if="activeName=='djrwinfo'">
                  <JNPF-table ref="djrwdataTable" v-loading="djrwlistLoading" :data="djrwdataTable" @sort-change="djrwsortChange" fixedNO custom-column :height=height>
                    <el-table-column prop="name" label="任务名称" width="200" fixed="left" sortable="custom">
                    </el-table-column>
                    <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
                    <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="cycle" label="周期" width="120"></el-table-column>
                    <el-table-column prop="unit" label="单位" width="110"></el-table-column>
                    <el-table-column prop="state" label="状态" sortable="custom" width="120" fixed="right" align="center">
                      <template slot-scope="scope">
                        <div v-if="scope.row.state == 'disabled'"><el-tag type="danger">禁用</el-tag></div>
                        <div v-else-if="scope.row.state == 'enable'"><el-tag type="success">启用</el-tag></div>
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

                    <el-table-column prop="departmentIdName" label="计划执行部门" width="120" />
                    <el-table-column prop="maintainerIdName" label="计划执行人" width="120"></el-table-column>

                    <el-table-column prop="nextCalibrationTime" label="计划检定日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="300"></el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <pagination :total="total" :page.sync="djrworderForm.pageNum" :limit.sync="djrworderForm.pageSize" @pagination="getdjrwinfo" />
                </div>
                <div v-if="activeName=='djjlinfo'">
                  <JNPF-table ref="djjldataTable" v-loading="djjllistLoading" :data="djjldataTable" @sort-change="djjlsortChange" fixedNO custom-column :height=height>
                    <el-table-column prop="verificationAgency" label="检定机构" width="200" sortable="custom" />
                    <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" sortable="custom" />
                    <el-table-column prop="equipmentIdName" label="工具名称" min-width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="departmentIdText" label="计划执行部门" width="150" />
                    <el-table-column prop="maintainerIdText" label="计划执行人" width="120"></el-table-column>
                    <el-table-column prop="planMaintenanceDate" label="计划检定日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="actualDepartmentIdText" label="实际执行部门" width="150" />
                    <el-table-column prop="actualMaintenanceIdText" label="实际执行人" width="120"></el-table-column>
                    <el-table-column prop="actualMaintenanceDate" label="实际检定日期" width="180" sortable="custom"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                    <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
                    <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                      </template>
                    </el-table-column>
                  </JNPF-table>
                  <pagination :total="djjltotal" :page.sync="djjlorderForm.pageNum" :limit.sync="djjlorderForm.pageSize" @pagination="getdjjlinfo" />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>
    
<script>
import { checkmaintenanceList, RepairRequestList, equMaintenanceList, VerificationrecordsList, verificationList } from '@/api/dailyManagement/Maintenance'
import { getEquEquipmentInfo } from '@/api/basicData/index'
export default {
  data() {
    return {
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      wxjltotal: 0,
      byrwtotal: 0,
      byjltotal: 0,
      djrwtotal: 0,
      djjltotal: 0,
      wxjlorderForm: {
        state: 'maintained',
        classAttribute: "tool",
        equipmentId: '',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "application_date" /* 使用倒序日期作为默认排序 */
        }],
      },
      byrworderForm: {
        equipmentId: '',
        classAttribute: "tool",
        taskType: 'maintenance',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "next_maintenance_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      byjlorderForm: {
        equipmentId: '',
        classAttribute: "tool",
        recordType: 'maintenance',
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "actual_maintenance_date" /* 使用倒序日期作为默认排序 */
        }],
      },
      djrworderForm: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "next_calibration_time" /* 使用倒序日期作为默认排序 */
        }],
      },
      djjlorderForm: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [{
          asc: false,
          column: ""
        }, {
          asc: false,
          column: "actual_maintenance_date" /* 使用倒序日期作为默认排序 */
        }],
      },
      deviceTypeList: [
        { value: "normal", label: "正常工具" },
        { value: "virtually", label: "虚拟工具" },
      ],
      // 工具状态
      equipmentStatusList: [
        {
          value: "normal",
          label: "正常"
        },
        {
          value: "repair",
          label: "维修"
        },
        {
          value: "verification",
          label: "检定"
        },
        {
          value: "use",
          label: "领用"
        },
        {
          value: "discard",
          label: "报废"
        },
        {
          value: "spare",
          label: "备用"
        },
        {
          value: "stop",
          label: "停用"
        }
      ],
      djjllistLoading: false,
      djjldataTable: [],
      djrwlistLoading: false,
      djrwdataTable: [],
      byjllistLoading: false,
      byjldataTable: [],
      byrwlistLoading: false,
      byrwdataTable: [],
      wxjllistLoading: false,
      wxjldataTable: [],
      dataFormLoading: false,
      id: '',
      dataForm: {},
      activeNames: ["basicInfo", "wbjl"],
      dataFormTwo: {
        productData: [],
      },
      btnType: undefined,
      activeName: "sbxxinfo",
      formLoading: false,
      title: ''
    }
  },
  watch: {
    activeName: {
      handler(newOption) {
        if (newOption == 'sbxxinfo') {
          this.getsbxxinfo()
        } else if (newOption == 'wxjlinfo') {
          this.getwxjlinfo()
        } else if (newOption == 'byrwinfo') {
          this.getbyrwinfo()
        } else if (newOption == 'byjlinfo') {
          this.getbyjlinfo()
        } else if (newOption == 'djrwinfo') {
          this.getdjrwinfo()
        } else {
          this.getdjjlinfo()
        }
      },
      // deep: true
    }
  },
  mounted() {
    this.switchStyle()
  },
  methods: {
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      let allHeight = this.$refs.main.clientHeight
      // let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      // let Heightradio = this.$refs.radio.clientHeight
      this.height = (allHeight - 298) < 500 ? 500 : (allHeight - 298)
      // 附带防抖的监听适配模式屏幕缩放
      window.onresize = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.switchStyle()
        }, 100);
      };
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    //工具信息
    getsbxxinfo() {
      this.dataFormLoading = true
      getEquEquipmentInfo(this.id).then(res => {
        this.dataForm = res.data
        this.dataForm.productCategoryName = res.data.categoryName
        this.dataForm.userDepartmentId = [this.dataForm.userDepartmentId]
        this.dataFormLoading = false
      }).catch(() => {
        this.dataFormLoading = false
      })
    },
    //维修记录
    getwxjlinfo() {
      this.wxjllistLoading = true
      this.wxjlorderForm.equipmentId = this.id
      RepairRequestList(this.wxjlorderForm).then(res => {
        this.wxjldataTable = res.data.records.map(item => {
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
        this.wxjltotal = res.data.total
        this.wxjllistLoading = false
      }).catch(() => {
        this.wxjllistLoading = false
      })
    },
    //保养任务
    getbyrwinfo() {
      this.byrwlistLoading = true
      this.byrworderForm.equipmentId = this.id
      checkmaintenanceList(this.byrworderForm).then(res => {
        this.byrwdataTable = res.data.records
        this.byrwtotal = res.data.total
        this.byrwlistLoading = false
      }).catch(() => {
        this.byrwlistLoading = false
      })
    },
    //保养记录
    getbyjlinfo() {
      this.byjllistLoading = true
      this.byjlorderForm.equipmentId = this.id
      equMaintenanceList(this.byjlorderForm).then(res => {
        this.byjldataTable = res.data.records.map(item => {
          if (item.picList && item.picList.length) item.picList = item.picList.map(o => { return JSON.parse(`{${o}}`) })
          return item
        })
        this.byjltotal = res.data.total
        this.byjllistLoading = false
      }).catch(() => {
        this.byjllistLoading = false
      })
    },
    //检定任务
    getdjrwinfo() {
      this.djrwlistLoading = true
      this.djrworderForm.equipmentId = this.id
      verificationList(this.djrworderForm).then(res => {
        this.djrwdataTable = res.data.records
        this.djrwtotal = res.data.total
        this.djrwlistLoading = false
      }).catch(() => {
        this.djrwlistLoading = false
      })
    },
    //检定记录
    getdjjlinfo() {
      this.djjllistLoading = true
      this.djjlorderForm.equipmentId = this.id
      VerificationrecordsList(this.djjlorderForm).then(res => {
        this.djjldataTable = res.data.records.map(item => {
          if (item.picList && item.picList.length) item.picList = item.picList.map(o => { return JSON.parse(`{${o}}`) })
          return item
        })
        this.djjltotal = res.data.total
        this.djjllistLoading = false
      }).catch(() => {
        this.djjllistLoading = false
      })
    },
    getTimes(time) {
      // 转换为式分秒
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt(time / 60 / 60 % 24)
      let m = parseInt(time / 60 % 60)
      let s = parseInt(time % 60)
      return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ? `${m} 分 ${s} 秒` : `${s} 秒`
    },
    wxjlsortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'createByName' || prop === 'applicantIdName' || prop === 'departmentIdName' || prop === 'equipmentState' || prop === 'equipmentIdCode' || prop === 'factoryFloor' || prop === 'mountedPlaces' || prop === 'maintenancePersonnelName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.wxjlorderForm.orderItems[0].asc = order !== "descending"
      this.wxjlorderForm.orderItems[0].column = order === null ? "" : newProp
      this.getwxjlinfo()
    },
    byrwsortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode' || prop === 'departmentIdName' || prop === 'maintainerIdName' || prop === 'createByName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.byrworderForm.orderItems[0].asc = order !== "descending"
      this.byrworderForm.orderItems[0].column = order === null ? "" : newProp
      this.getbyrwinfo()
    },
    byjlsortChange({ prop, order }) {
      let newProp
      if (prop === 'createByName' || prop === 'cycle' || prop === 'unit' || prop === 'equipmentIdName' || prop === 'equipmentIdCode' || prop === 'departmentIdText' || prop === 'maintainerIdText' || prop === 'actualDepartmentIdText' || prop === 'actualMaintenanceIdText' || prop === 'maintenanceTaskIdText' || prop === 'factoryFloor' || prop === 'mountedPlaces') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.byjlorderForm.orderItems[0].asc = order !== "descending"
      this.byjlorderForm.orderItems[0].column = order === null ? "" : newProp
      this.getbyjlinfo()
    },
    djrwsortChange({ prop, order }) {
      let newProp
      if (prop === 'equipmentIdName' || prop === 'equipmentIdCode' || prop === 'departmentIdName' || prop === 'maintainerIdName' || prop === 'createByName') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.djrworderForm.orderItems[0].asc = order !== "descending"
      this.djrworderForm.orderItems[0].column = order === null ? "" : newProp
      this.getdjrwinfo()
    },
    djjlsortChange({ prop, order }) {
      let newProp
      if (prop === 'createByName' || prop === 'cycle' || prop === 'unit' || prop === 'equipmentIdName' || prop === 'equipmentIdCode' || prop === 'departmentIdText' || prop === 'maintainerIdText' || prop === 'actualDepartmentIdText' || prop === 'actualMaintenanceIdText' || prop === 'maintenanceTaskIdText' || prop === 'factoryFloor' || prop === 'mountedPlaces') {
        newProp = prop
      } else {
        newProp = prop.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
      }
      this.djjlorderForm.orderItems[0].asc = order !== "descending"
      this.djjlorderForm.orderItems[0].column = order === null ? "" : newProp
      this.getdjjlinfo()
    },
    goBack() {
      this.$emit('close')
    },
    init(id, btnType) {
      this.id = id
      this.getsbxxinfo()
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-radio-button--small .el-radio-button__inner {
  border-bottom: none;
}
::v-deep .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 4px 0 0;
}
::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 4px 0 0 0;
}
::v-deep .el-tabs__content {
  padding: 0 5px;
}
::v-deep .maintenancelabel {
  margin-top: 6px;
  font-size: 16px;
  line-height: 28px;
}
.stoclInfo {
  position: relative;
  padding: 5px;
  .maintenancetitle {
    font-size: 24px;
    font-weight: bold;
  }
  .equipmentstatus {
    width: 120px;
    height: 120px;
    position: absolute;
    right: 10px;
    bottom: 0;
  }
}
.required {
  color: red;
  margin-right: 4px;
}
::v-deep .data-form {
  margin-bottom: 18px;
  .el-form-item--small.el-form-item {
    margin-bottom: 0 !important;
  }
}
.JNPF-preview-main .main {
  padding-top: 0;
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
  padding: 0 0px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
    