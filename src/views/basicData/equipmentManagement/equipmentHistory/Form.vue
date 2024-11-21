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
        <el-collapse v-model="activeNames">
          <el-collapse-item title="设备信息" name="basicInfo">
            <div class="stoclInfo" ref="stoclInfo">
              <div class="maintenancetitle">{{dataForm.name}}</div>
              <el-descriptions :column="1" label-class-name="maintenancelabel" content-class-name="maintenancelabel">
                <el-descriptions-item label="创建时间">{{dataForm.createTime}}</el-descriptions-item>
                <el-descriptions-item label="创建人">{{dataForm.createByName}}</el-descriptions-item>
              </el-descriptions>
              <img class="equipmentstatus" v-if="dataForm.state=='normal'" src="@/assets/images/zhengchang.png" alt="">
              <img class="equipmentstatus" v-if="dataForm.state=='repair'" src="@/assets/images/weixiuzhong.png" alt="">
              <img class="equipmentstatus" v-if="dataForm.state=='discard'" src="@/assets/images/baofei.png" alt="">
              <img class="equipmentstatus" v-if="dataForm.state=='stop'" src="@/assets/images/tingyong.png" alt="">
              <img class="equipmentstatus" v-if="dataForm.state=='spare'" src="@/assets/images/beiyong.png" alt="">
            </div>
            <!-- <el-tabs v-model="activeName" type="card" @tab-click="handleClick"> -->
            <div style="padding-left: 5px;border-bottom: 1px solid #dcdfe6;" ref="radio">
              <el-radio-group v-model="activeName">
                <el-radio-button label="sbxxinfo">设备信息</el-radio-button>
                <el-radio-button label="wxjlinfo">维修记录</el-radio-button>
                <el-radio-button label="byrwinfo">保养任务</el-radio-button>
                <el-radio-button label="byjlinfo">保养记录</el-radio-button>
                <el-radio-button label="djrwinfo">点检任务</el-radio-button>
                <el-radio-button label="djjlinfo">点检记录</el-radio-button>
              </el-radio-group>
            </div>
            <div style="padding: 5px;">
              <div v-if="activeName=='sbxxinfo'">
                <el-form ref="dataForm" :model="dataForm" label-width="160px" label-position="top" v-loading="dataFormLoading">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="所属分类" prop="productCategoryName" ref="productCategoryName">
                        <ComSelect-list :isdisabled="true" v-model="dataForm.productCategoryName" placeholder="请选择设备类型" auth :title="'选择设备类型'" :method="getCategoryTrees" :requestObj="requestObjTwo" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="isProjectSwitch==='1'">
                      <el-form-item label="所属项目" prop="projectName">
                        <el-input v-model="dataForm.projectName" placeholder="请输入所属项目" maxlength="20" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入设备编码" maxlength="20" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入设备名称" maxlength="20" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备规格" prop="specModel">
                        <el-input maxlength="50" v-model="dataForm.specModel" placeholder="请输入设备规格" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备类型" prop="deviceType">
                        <el-select v-model="dataForm.deviceType" placeholder="请选择设备类型" :disabled="true" style="width: 100%;">
                          <el-option v-for="item in deviceTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定使用年限" prop="serviceLife">
                        <el-input maxlength="9" oninput="value = value.replace(/\D/g, '')" v-model.number="dataForm.serviceLife" placeholder="请输入额定使用年限" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定电压V" prop="ratedVoltage">
                        <el-input v-model="dataForm.ratedVoltage" placeholder="请输入额定电压V" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定电流A" prop="ratedCurrent">
                        <el-input v-model="dataForm.ratedCurrent" placeholder="请输入额定电流A" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="额定功率KW" prop="power">
                        <el-input v-model="dataForm.power" placeholder="请输入额定功率KW" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="供应商" prop="partnerName">
                        <ComSelect-list :isdisabled="true" v-model="dataForm.partnerName" placeholder="请选择供应商" auth @change="selectPartner" :title="'选择供应商'" :method="getCooperativeData" :requestObj="parentRequsetObj" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="维修人" prop="repairUserId">
                        <user-select v-model="dataForm.repairUserId" placeholder="请选择维修人" clearable style="width: 100%;" :disabled="true" @change="hanglerepairUserId">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="使用人" prop="userId">
                        <user-select v-model="dataForm.userId" placeholder="请选择使用人" style="width: 100%;" :disabled="true" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="8">
                      <el-form-item label="使用部门" prop="userDepartmentId">
                        <el-input v-model="dataForm.userDepartmentName" readonly placeholder="请输入使用部门" :disabled="true" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="车间" prop="factoryFloorId">
                        <el-select v-model="dataForm.factoryFloorId" filterable placeholder="请选择车间" :disabled="true" clearable style="width: 100%;" :loading="factorylistLoading">
                          <el-option v-for="item in factoryFloorList" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="安装地点" prop="mountedPlacesId">
                        <el-select v-model="dataForm.mountedPlacesId" filterable placeholder="请选择安装地点" :disabled="true" clearable style="width: 100%;" :loading="factorylistLoading">
                          <el-option v-for="item in mountedPlacesList" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购金额(万元)" prop="purchaseAmount">
                        <el-input v-model="dataForm.purchaseAmount" placeholder="请输入采购金额" :disabled="true">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="生产厂家" prop="supplier">
                        <el-input maxlength="200" v-model="dataForm.supplier" placeholder="请输入生产厂家" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="序列号" prop="serialNo">
                        <el-input maxlength="100" v-model="dataForm.serialNo" placeholder="请输入序列号" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24" v-if="type !== 'add'">
                      <el-form-item label="设备状态" prop="state">
                        <el-select v-model="dataForm.state" placeholder="请选择设备状态" :disabled="true" style="width: 100%;">
                          <el-option v-for="( item, index ) in  equipmentStatusList " :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="理论节拍" prop="theoryBeat">
                        <el-input v-model.number="dataForm.theoryBeat" placeholder="请输入理论节拍" :disabled="true" maxlength="8" oninput="value = value.replace(/[^0-9]/g,'')" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="用途" prop="usin">
                        <el-input maxlength="200" v-model="dataForm.usin" placeholder="请输入用途" :disabled="true" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="重量（KG）" prop="weight">
                        <el-input v-model="dataForm.weight" placeholder="请输入重量" :disabled="true">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="设备原值（万元）" prop="equipmentValue">
                        <el-input v-model="dataForm.equipmentValue" placeholder="请输入设备原值" :disabled="true">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="长（cm）" prop="equLong">
                        <el-input v-model="dataForm.equLong" placeholder="请输入长" :disabled="true">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="宽（cm）" prop="width">
                        <el-input v-model="dataForm.width" placeholder="请输入宽" :disabled="true">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="高（cm）" prop="height">
                        <el-input v-model="dataForm.height" placeholder="请输入高" :disabled="true">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="保修截至时间" prop="warrantyDate">
                        <el-date-picker v-model="dataForm.warrantyDate" type="datetime" placeholder="请选择保修截至时间" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true" style="width: 100%;" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购人员" prop="purchaserId">
                        <user-select v-model="dataForm.purchaserId" placeholder="请选择采购人员" style="width: 100%;" :disabled="true">
                        </user-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="采购日期" prop="purchaseDate">
                        <el-date-picker v-model="dataForm.purchaseDate" type="date" placeholder="请选择购买日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="制造日期" prop="productDate">
                        <el-date-picker v-model="dataForm.productDate" type="date" placeholder="请选择制造日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="8" :xs="24">
                      <el-form-item label="报废日期" prop="scrapDate">
                        <el-date-picker v-model="dataForm.scrapDate" type="date" placeholder="请选择报废日期" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input maxlength="200" class="shuru" v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :disabled="true" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
              <div v-if="activeName=='wxjlinfo'">
                <div class="axis-content">
                  <div class="content-title">维修记录：<span>{{wxjldataTable.length}}</span>条</div>
                </div>
                <JNPF-table ref="wxjldataTable" v-loading="wxjllistLoading" @sort-change="wxjlsortChange" :data="wxjldataTable" fixedNO custom-column :height=height>
                  <el-table-column prop="maintenanceNo" label="维修单号" min-width="200" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" sortable="custom" />
                  <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom"></el-table-column>
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
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
                  <el-table-column prop="equipmentState" label="设备状态" width="120" sortable="custom">
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
                      <el-button size="mini" type="text" @click="wxhandleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="wxjlorderForm.pageNum" :limit.sync="wxjlorderForm.pageSize" @pagination="getwxjlinfo" />
              </div>
              <div v-if="activeName=='byrwinfo'">
                <div class="axis-content">
                  <div class="content-title">保养任务：<span>{{byrwdataTable.length}}</span>条</div>
                </div>
                <JNPF-table ref="byrwdataTable" v-loading="byrwlistLoading" :data="byrwdataTable" @sort-change="byrwsortChange" fixedNO custom-column :height=height>
                  <el-table-column prop="name" label="任务名称" min-width="200" fixed="left" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" fixed="left" sortable="custom" />
                  <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" fixed="left" sortable="custom"></el-table-column>
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
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
                      <el-button size="mini" type="text" @click="byrwhandleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="byrworderForm.pageNum" :limit.sync="byrworderForm.pageSize" @pagination="getbyrwinfo" />
              </div>
              <div v-if="activeName=='byjlinfo'">
                <div class="axis-content">
                  <div class="content-title">保养记录：<span>{{byjldataTable.length}}</span>条</div>
                </div>
                <JNPF-table ref="byjldataTable" v-loading="byjllistLoading" :data="byjldataTable" @sort-change="byjlsortChange" fixedNO custom-column :height=height>
                  <el-table-column prop="maintenanceTaskIdText" label="任务名称" min-width="180" sortable="custom" />
                  <el-table-column prop="equipmentIdCode" label="设备编码" min-width="200" sortable="custom" />
                  <el-table-column prop="equipmentIdName" label="设备名称" min-width="200" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
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
                      <el-button size="mini" type="text" @click="byjlhandleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="byjlorderForm.pageNum" :limit.sync="byjlorderForm.pageSize" @pagination="getbyjlinfo" />
              </div>
              <div v-if="activeName=='djrwinfo'">
                <div class="axis-content">
                  <div class="content-title">点检任务：<span>{{djrwdataTable.length}}</span>条</div>
                </div>
                <JNPF-table ref="djrwdataTable" v-loading="djrwlistLoading" :data="djrwdataTable" @sort-change="djrwsortChange" fixedNO custom-column :height=height>
                  <el-table-column prop="name" label="任务名称" width="200" sortable="custom">
                  </el-table-column>
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                  <el-table-column prop="cycle" label="周期" width="120" sortable="custom"></el-table-column>
                  <el-table-column prop="unit" label="单位" width="110" sortable="custom"></el-table-column>
                  <el-table-column prop="equipmentIdCode" label="设备编码" width="200" sortable="custom" />
                  <el-table-column prop="equipmentIdName" label="设备名称" width="200" sortable="custom"></el-table-column>
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
                  <el-table-column prop="departmentIdName" label="计划点检部门" width="150" sortable="custom" />
                  <el-table-column prop="maintainerIdName" label="计划点检人" width="140" sortable="custom"></el-table-column>
                  <el-table-column prop="nextMaintenanceTime" label="下次点检时间" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                  <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="300"></el-table-column>
                  <el-table-column label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="djrwhandleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="total" :page.sync="djrworderForm.pageNum" :limit.sync="djrworderForm.pageSize" @pagination="getdjrwinfo" />
              </div>
              <div v-if="activeName=='djjlinfo'">
                <div class="axis-content">
                  <div class="content-title">点检记录：<span>{{djjldataTable.length}}</span>条</div>
                </div>
                <JNPF-table ref="djjldataTable" v-loading="djjllistLoading" :data="djjldataTable" @sort-change="djjlsortChange" fixedNO custom-column :height=height>
                  <el-table-column prop="equipmentIdCode" label="设备编码" width="200" sortable="custom" />
                  <el-table-column prop="equipmentIdName" label="设备名称" width="200" sortable="custom" />
                  <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
                  <el-table-column prop="factoryFloor" label="使用车间" min-width="140" sortable="custom" />
                  <el-table-column prop="mountedPlaces" label="安装地点" min-width="140" sortable="custom" />
                  <el-table-column prop="cycle" label="周期" width="90" sortable="custom" />
                  <el-table-column prop="unit" label="单位" width="90" sortable="custom" />
                  <el-table-column prop="departmentIdText" label="计划点检部门" width="150" sortable="custom" />
                  <el-table-column prop="maintainerIdText" label="计划点检人" width="140" sortable="custom"></el-table-column>
                  <el-table-column prop="planMaintenanceDate" label="计划点检日期" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="actualDepartmentIdText" label="实际点检部门" width="150" sortable="custom" />
                  <el-table-column prop="actualMaintenanceIdText" label="实际点检人" width="140" sortable="custom"></el-table-column>
                  <el-table-column prop="actualMaintenanceDate" label="实际点检日期" width="180" sortable="custom"></el-table-column>
                  <el-table-column prop="picList" label="点检拍照" min-width="160">
                    <template slot-scope="scope">
                      <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.picList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="inspectionResults" label="点检结果" width="120" fixed="right" align="center" sortable="custom">
                    <template slot-scope="scope">
                      <div v-if="scope.row.inspectionResults == 'normal'"><el-tag type="success">正常</el-tag></div>
                      <div v-else-if="scope.row.inspectionResults == 'abnormal'">
                        <el-tag type="danger">异常</el-tag>
                      </div>
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
                  <el-table-column prop="createTime" label="创建时间" width="200" sortable="custom"></el-table-column>
                  <el-table-column prop="createByName" label="创建人" width="120" sortable="custom"></el-table-column>
                  <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
                  <el-table-column label="操作" width="140" fixed="right">
                    <template slot-scope="scope">
                      <el-button size="mini" type="text" @click="djjlhandleUserRelation(scope.row.id, 'look')">查看详情</el-button>
                    </template>
                  </el-table-column>
                </JNPF-table>
                <pagination :total="djjltotal" :page.sync="djjlorderForm.pageNum" :limit.sync="djjlorderForm.pageSize" @pagination="getdjjlinfo" />
              </div>
            </div>
            <!-- </el-tabs> -->
          </el-collapse-item>
        </el-collapse>
      </div>
      <wxForm v-if="wxformVisible" ref="wxForm" @close="closeForm" />
      <byrwForm v-if="byrwformVisible" ref="byrwForm" @close="closeForm" />
      <byjlForm v-if="byjlformVisible" ref="byjlForm" @close="closeForm" />
      <djrwForm v-if="djrwformVisible" ref="djrwForm" @close="closeForm" />
      <djjlForm v-if="djjlformVisible" ref="djjlForm" @close="closeForm" />
    </div>
  </transition>
</template>
    
<script>
import wxForm from "@/views/dailyManagement/maintenanceManagement/deviceservice/Form.vue";
import byrwForm from "@/views/dailyManagement/Maintenance/maintenanceTasks/Form.vue";
import byjlForm from "@/views/dailyManagement/Maintenance/maintenanceRecords/Form.vue";
import djrwForm from "@/views/dailyManagement/pointInspection/inspectionTask/Form.vue";
import djjlForm from "@/views/dailyManagement/pointInspection/inspectionRecords/Form.vue";
import { checkmaintenanceList, RepairRequestList, equMaintenanceList } from '@/api/dailyManagement/Maintenance'
import { getEquEquipmentInfo } from '@/api/basicData/index'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
export default {
  mixins: [getProjectList],
  components: { wxForm, byrwForm, byjlForm, djrwForm, djjlForm },
  data() {
    return {
      isProjectSwitch: '',
      djjlformVisible: false,
      djrwformVisible: false,
      byjlformVisible: false,
      byrwformVisible: false,
      wxformVisible: false,
      height: 0,
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
        classAttribute: "equipment",
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
        classAttribute: "equipment",
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
        classAttribute: "equipment",
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
        equipmentId: '',
        taskType: 'inspection',
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
      djjlorderForm: {
        equipmentId: '',
        recordType: 'inspection',
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
        { value: "normal", label: "正常设备" },
        { value: "virtually", label: "虚拟设备" },
      ],
      // 设备状态
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
      title: '',
      timeout: null
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
  async created() {
    await this.getProjectSwitch('system', 'project')
  },
  mounted() {
    this.switchStyle()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    djjlhandleUserRelation(id, btntype) {
      this.djjlformVisible = true
      this.$nextTick(() => {
        this.$refs.djjlForm.init(id, btntype)
      })
    },
    djrwhandleUserRelation(id, btntype) {
      this.djrwformVisible = true
      this.$nextTick(() => {
        this.$refs.djrwForm.init(id, btntype)
      })
    },
    byjlhandleUserRelation(id, btntype) {
      this.byjlformVisible = true
      this.$nextTick(() => {
        this.$refs.byjlForm.init(id, btntype)
      })
    },
    byrwhandleUserRelation(id, btntype) {
      this.byrwformVisible = true
      this.$nextTick(() => {
        this.$refs.byrwForm.init(id, btntype)
      })
    },
    wxhandleUserRelation(id, btntype) {
      this.wxformVisible = true
      this.$nextTick(() => {
        this.$refs.wxForm.init(id, btntype)
      })
    },
    // 关闭新建编辑页面
    closeForm(isRefresh) {
      this.djjlformVisible = false
      this.djrwformVisible = false
      this.byjlformVisible = false
      this.byrwformVisible = false
      this.wxformVisible = false
    },
    //自适应窗口
    async switchStyle() {
      await this.$nextTick();
      console.log(this.$refs.main, 'this.$refs.main')
      let allHeight = this.$refs.main.clientHeight
      console.log(allHeight, 'allHeight')
      // let HeightstoclInfo = this.$refs.stoclInfo.clientHeight
      // let Heightradio = this.$refs.radio.clientHeight
      this.height = (allHeight - 340) < 500 ? 500 : (allHeight - 340)
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
    //设备信息
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
      this.wxjlorderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
      this.byrworderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
      this.byjlorderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
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
    //点检任务
    getdjrwinfo() {
      this.djrwlistLoading = true
      this.djrworderForm.equipmentId = this.id
      this.djrworderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      checkmaintenanceList(this.djrworderForm).then(res => {
        this.djrwdataTable = res.data.records
        this.djrwtotal = res.data.total
        this.djrwlistLoading = false
      }).catch(() => {
        this.djrwlistLoading = false
      })
    },
    //点检记录
    getdjjlinfo() {
      this.djjllistLoading = true
      this.djjlorderForm.equipmentId = this.id
      this.djjlorderForm.projectId = this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      equMaintenanceList(this.djjlorderForm).then(res => {
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
.main {
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
  .axis-content {
    .content-title {
      padding: 8px;
      font-size: 16px;
      span {
        margin-right: 3px;
        font-weight: 700;
      }
    }
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
  padding-top: 10px;
  ::v-deep .el-collapse-item__wrap {
    border: 1px solid #dcdfe6 !important;
    border-top: none;
    margin-bottom: 0;
    padding: 0 0px 0px;
    border-top: none !important;
  }
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

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
    