<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div :class="['JNPF-common-page-header', btnType === 'look' ? 'noButtons' : '']">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!btnType"/> -->
        <el-page-header @back="goBack" :content="btnType == 'add' ? '新建维修任务' : btnType == 'edit' ? '编辑维修任务' : btnType == 'start' ? '审核派工' : btnType == 'end' ? '完成维修' : '查看工具维修'" />
        <div class="options">
          <!-- <el-button type="success" :loading="btnLoading" @click="handleConfirm('draft')">
            保存草稿</el-button> -->
          <el-button type="primary" v-if="btnType != 'look'" :loading="btnLoading" @click="handleConfirm('submit')">
            保存并提交</el-button>
          <!-- <el-button type="primary" :loading="btnLoading" @click="handleConfirm('submit')">
            {{ $t('common.submitButton') }}
          </el-button> -->
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <div class="vux-flexbox stage-state vux-flex-row">
          <el-button @click="stateaction('report')" class="button-info">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc==='report'}">
              <div class="stage-name text-one-ellipsis">报修信息</div>
              <!-- <div class="stage-value">20%</div> -->
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc==='report'}"></div>
            </div>
          </el-button>
          <el-button @click="stateaction('examine')" class="button-info" :disabled="(dataForm.state == 'toBeMaintain'&&btnType == 'edit')||(dataForm.state == 'toBeMaintain'&&btnType == 'look')||(dataForm.state == 'maintaining'&&!dataForm.reviewComments)">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc==='examine'}">
              <div class="stage-name text-one-ellipsis">审核信息</div>
              <!-- <div class="stage-value">30%</div> -->
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc==='examine'}"></div>
            </div>
          </el-button>
          <el-button @click="stateaction('repair')" class="button-info" :disabled="dataForm.state == 'toBeMaintain'||(dataForm.state == 'maintaining'&&btnType == 'look')">
            <div class="stage-state-item state-undo is-center" :class="{'state-suc':statesuc==='repair'}">
              <div class="stage-name text-one-ellipsis">维修信息</div>
              <!-- <div class="stage-value">50%</div> -->
              <div class="state-arrow arrow-left"></div>
              <div class="state-arrow arrow-right" :class="{'state-suc':statesuc==='repair'}"></div>
            </div>
          </el-button>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" class=".el-table">
          <el-collapse v-model="activeNames">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="160px" label-position="top">
              <el-collapse-item title="维修信息" name="wxInfo" v-if="statesuc==='repair'">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="故障原因" prop="reason">
                      <el-input v-model="dataForm.reason" placeholder="请输入故障原因" :disabled="btnType == 'look'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="维修完成时间" prop="repairCompletionTime">
                      <el-date-picker v-model="dataForm.repairCompletionTime" type="datetime" placeholder="请选择维修完成时间" :disabled="btnType == 'look'" style="width: 100%;" clearable @change="nextMaintenanceTimeactionwan" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < times - 1000 * 3599 * 24;
                        }
                      }">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="12" :xs="24">
                    <el-form-item label="解决措施" prop="solutionMeasures">
                      <template slot="label">
                        <span>解决措施</span>
                        <span>>></span>
                        <el-button type="text" @click="devicesolutionMeasures">查看本工具维修记录</el-button>
                      </template>
                      <el-input v-model="dataForm.solutionMeasures" placeholder="请输入解决措施" :disabled="btnType == 'look'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="维修完成照片" prop="afterPicList">
                      <UploadImg v-model="dataForm.afterPicList" :disabled="btnType == 'look'"></UploadImg>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="更换零部件信息" name="ghlbjxx" v-if="statesuc==='repair'">
                <div v-if="btnType !== 'look'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="addtable()">添加零部件</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDeleteling">批量删除</el-button>|
                </div>
                <el-form :model="dataForms" v-bind="dataForms" ref="productForms" class="data-form">
                  <el-table ref="product" :data="dataForms.lines" @selection-change="handeleProductInfoDataling">
                    <el-table-column type="selection" width="60" align="center" v-if="btnType !== 'look'" key="22" />
                    <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                    <el-table-column prop="partCode" label="备件编码" min-width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="partName" label="备件名称" min-width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="drawingNo" label="品名规格" min-width="160" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="mainUnit" label="单位" width="120" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="num" label="数量" width="180">
                      <template slot="header">
                        <span class="required">*</span>数量
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'lines.' + scope.$index + '.' + 'num'" :rules='productRulesling.num'>
                          <el-input :title="scope.row.num" v-model="scope.row.num" placeholder="请输入数量" :disabled="btnType == 'look'" maxlength="11" style="width: 100%;">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" v-if="btnType !== 'look'" key="11">
                      <template slot-scope="scope">
                        <el-button type="text" @click="deltable(scope)" style=" color: #ff3a3a">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="审核信息" name="basicInfo" v-if="statesuc==='examine'">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="审核意见" prop="reviewComments">
                      <el-select v-model="dataForm.reviewComments" placeholder="请选择审核意见" @change="reviewCommentschange" clearable style="width: 100%;" :disabled="btnType == 'look'|| btnType == 'end'">
                        <el-option v-for="(item, index) in reviewCommentsList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.reviewComments=='reject'">
                    <el-form-item label="驳回理由" prop="rejectReason">
                      <el-select v-model="dataForm.rejectReason" placeholder="请选择驳回理由" clearable style="width: 100%;" :disabled="btnType == 'look'|| btnType == 'end'">
                        <el-option v-for="(item, index) in rejectReasonList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="dataForm.reviewComments!=='reject'">
                    <el-form-item label="紧急程度" prop="degree">
                      <el-select v-model="dataForm.degree" placeholder="请选择紧急程度" clearable style="width: 100%;" :disabled="btnType == 'look'|| btnType == 'end'">
                        <el-option v-for="(item, index) in degreeList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :sm="6" :xs="24">
                      <el-form-item label="维修负责人" prop="maintenancePersonnel">
                        <user-select v-model="dataForm.maintenancePersonnel" placeholder="请选择维修负责人" clearable style="width: 100%;" :disabled="btnType == 'look' || btnType == 'end'" @change="hangleSelectSales">
                        </user-select>
                      </el-form-item>
                    </el-col> -->
                  <el-col :sm="6" :xs="24" v-if="dataForm.reviewComments!=='reject'">
                    <el-form-item label="派工时间" prop="startMaintenanceTime">
                      <el-date-picker v-model="dataForm.startMaintenanceTime" type="datetime" placeholder="请选择派工时间" :disabled="btnType == 'look' || btnType == 'end'" style="width: 100%;" clearable @change="nextMaintenanceTimeactionwei" :picker-options="{
                        disabledDate(time) {
                          return time.getTime() < timefaultStartTime - 1000 * 3599 * 24;
                        }
                      }">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="dataForm.reviewComments=='reject'?12:6" :xs="24">
                    <el-form-item label="备注" prop="remark">
                      <el-input v-model="dataForm.remark" placeholder="请输入备注" :disabled="btnType == 'look'|| btnType == 'end'" type="textarea" maxlength="200" :rows="2" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="报修信息" name="bxInfo" v-if="statesuc==='report'">
                <el-row :gutter="30" class="custom-row">
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="维修单号" prop="maintenanceNo">
                      <el-input v-model="dataForm.maintenanceNo" placeholder="请输入维修单号" :disabled="(btnType === 'look' || btnType == 'start' || btnType == 'end')?true:codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="申请部门" prop="departmentId">
                      <ComSelect v-model="organizeIdTrees" :disabled="btnType === 'look' || btnType == 'start' || btnType == 'end'" placeholder="请选择申请部门" auth :dialogTitle="'请选择申请部门'" @change="changedepartment" :currOrgId="dataForm.departmentId || '0'" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="申请人" prop="applicantId">
                      <el-select v-model="dataForm.applicantIdName" placeholder="请选择申请人" clearable style="width: 100%;" :disabled="btnType === 'look' || btnType == 'start' || btnType == 'end'" filterable @change="selectsales">
                        <el-option v-for="( item, index ) in  salesList " :key="index" :label="item.name" :disabled="btnType == 'look'" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="申请时间" prop="applicationDate">
                      <el-date-picker v-model="dataForm.applicationDate" type="date" value-format="yyyy-MM-dd" style="width: 100%;" placeholder="请选择申请时间" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="故障开始时间" prop="faultStartTime">
                      <el-date-picker v-model="dataForm.faultStartTime" type="datetime" placeholder="请选择故障开始时间" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'" style="width: 100%;" @change="nextMaintenanceTimeaction" :picker-options="pickerOptions">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="工具名称" prop="equipmentId">
                      <el-input v-model="dataForm.equipmentIdName" placeholder="请选择工具名称" readonly @focus="openSeleceProductDialogss" :disabled="btnType !== 'add'">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="工具编码" prop="equipmentIdCode">
                      <el-input v-model="dataForm.equipmentIdCode" placeholder="请输入工具编码" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="isProjectSwitch==='1'">
                    <el-form-item label="所属项目" prop="projectName">
                      <el-input v-model="dataForm.projectName" placeholder="请输入所属项目" maxlength="20" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24">
                    <el-form-item label="用途" prop="usin">
                      <el-input v-model="dataForm.usin" placeholder="请输入用途" :disabled="true" />
                    </el-form-item>
                  </el-col>
                  <el-col :sm="6" :xs="24" v-if="btnType == 'look'">
                    <el-form-item label="状态" prop="state">
                      <el-select v-model="dataForm.state" placeholder="请选择状态" clearable style="width: 100%;" :disabled="btnType == 'look'">
                        <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :sm="24" :xs="24">
                    <el-form-item label="故障情况照片" prop="frontPicList">
                      <UploadImg v-model="dataForm.frontPicList" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'"></UploadImg>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item title="故障信息" name="gzxx" v-if="statesuc==='report'||statesuc==='repair'">
                <div v-if="btnType == 'edit' || btnType == 'add'">
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" icon="el-icon-plus" :disabled="btnType == 'look' ? true : false" @click="openSeleceProductDialog()">选择故障类型</el-button>|
                  <el-button type="text" style="margin-right:8px;margin-left:8px; font-size:14px!important" :disabled="btnType == 'look' ? true : false" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>|
                </div>
                <el-form :model="dataFormTwo" v-bind="dataFormTwo" ref="productForm" class="data-form">
                  <el-table ref="product" :data="dataFormTwo.productData" v-bind="dataFormTwo.data" @selection-change="handeleProductInfoData">
                    <el-table-column type="selection" width="60" v-if="btnType == 'edit' || btnType == 'add'" key="1" align="center" />
                    <el-table-column type="index" width="60" label="序号" align="center" />
                    <el-table-column prop="faultTypeCode" label="故障类型编码" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="faultTypeName" label="故障类型名称" width="200" show-overflow-tooltip>
                      <template slot="header">
                        <span class="required">*</span>故障类型名称
                      </template>
                    </el-table-column>
                    <el-table-column prop="faultLocationName" label="故障部位名称" width="200">
                      <template slot="header">
                        <span class="required">*</span>故障部位名称
                      </template>
                      <template slot-scope="scope">
                        <el-form-item :prop="'productData.' + scope.$index + '.' + 'faultLocationName'" :rules='productRules.faultLocationName'>
                          <el-input v-model="scope.row.faultLocationName" placeholder="请选择故障部位名称" readonly @focus="openSeleceProductDialogs(scope.$index)" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'">
                          </el-input>
                        </el-form-item>
                      </template>
                    </el-table-column>
                    <el-table-column prop="faultLocationCode" label="故障部位编码" width="200" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="faultDescription" label="故障描述" min-width="230">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.faultDescription" placeholder="请输入故障描述" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'" maxlength="200" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="repairResult" label="是否完成" width="90" v-if="(btnType == 'end'&&statesuc==='repair')||(btnType == 'look'&&statesuc==='repair')">
                      <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.repairResult" true-label="finished" false-label="not_finished" :disabled="btnType == 'look'"></el-checkbox>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" v-if="btnType == 'edit' || btnType == 'add'||btnType == 'end'||(btnType == 'look'&&dataForm.solutionMeasures)" key="30">
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleDel(scope)" v-if="btnType == 'edit' || btnType == 'add'" style="color: #ff3a3a">删除</el-button>
                        <el-button type="text" @click="solutionMeasuresfun(scope.row,scope.$index)" v-if="btnType == 'end'||(btnType == 'look'&&dataForm.solutionMeasures)">解决措施</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </el-collapse-item>
              <el-collapse-item title="报修附件" name="bxfj" v-if="statesuc==='report'">
                <UploadWj v-model="datafilelist" :disabled="btnType == 'look' || btnType == 'start' || btnType == 'end'" :detailed="btnType == 'look'"></UploadWj>
              </el-collapse-item>
            </el-form>
          </el-collapse>
        </el-tabs>
      </div>
      <!-- 本工具维修记录 -->
      <el-dialog title="本工具维修记录" :visible.sync="dialogTableVisible" :append-to-body="true" :close-on-click-modal="false">
        <JNPF-table v-loading="TablelistLoading" :data="tableDatalist" custom-column>
          <el-table-column prop="maintenanceNo" label="维修单号" min-width="200">
          </el-table-column>
          <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" />
          <el-table-column prop="equipmentIdName" label="工具名称" min-width="200"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
          <el-table-column prop="usin" label="用途" min-width="140" />
          <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
            <template slot-scope="scope">
              <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="faultStartTime" label="故障开始时间" width="180"></el-table-column>
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
          <el-table-column prop="maintenanceDuration" label="维修时长" min-width="160"></el-table-column>
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
          <el-table-column prop="applicationDate" label="申请日期" width="180"></el-table-column>
          <el-table-column prop="state" label="状态" width="120" fixed="right" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.state == 'toBeMaintain'"><el-tag type="danger">待派工</el-tag></div>
              <div v-else-if="scope.row.state == 'maintaining'"><el-tag type="warning">正在维修</el-tag></div>
              <div v-else-if="scope.row.state == 'maintained'"><el-tag type="success">已维修</el-tag></div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          <el-table-column prop="remark" label="备注" min-width="200"></el-table-column>
        </JNPF-table>
      </el-dialog>
      <el-dialog title="解决措施" :visible.sync="outerVisible" :append-to-body="true" :close-on-click-modal="false">
        <el-form :model="dataFormline" ref="dataFormline" :rules="dataRuleline" label-width="160px" label-position="top">
          <el-col :sm="24" :xs="24">
            <el-form-item label="解决措施" prop="solutionMeasures">
              <el-input v-model="dataFormline.solutionMeasures" type="textarea" :rows="3" :disabled="btnType == 'look'"></el-input>
            </el-form-item>
            <el-button style="position: absolute;top:82px;right: 30px;" type="text" @click="usedsolutionMeasures">查看历史解决措施</el-button>
          </el-col>
          <el-checkbox v-model="dataFormline.knowledgeFlag" :disabled="btnType == 'look'">保存为知识库</el-checkbox>
        </el-form>
        <el-dialog width="60%" title="历史解决措施" :visible.sync="innerVisible" append-to-body>
          <JNPF-table ref="dataTable" v-loading="listLoading" :data="tableData" custom-column :height=500>
            <el-table-column prop="equipmentIdCode" label="工具编码" min-width="200" />
            <el-table-column prop="equipmentIdName" label="工具名称" min-width="200"></el-table-column>
          <el-table-column prop="projectName" label="所属项目" min-width="120" v-if="isProjectSwitch==='1'" key="projectName" />
            <el-table-column prop="faultTypeName" label="故障类型名称" min-width="160" />
            <el-table-column prop="faultLocationName" label="故障部位名称" min-width="160" />
            <el-table-column prop="frontPicList" label="故障情况照片" min-width="140">
              <template slot-scope="scope">
                <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.frontPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="faultDescription" label="故障描述" min-width="160" />
            <el-table-column prop="solutionMeasures" label="解决措施" min-width="200"></el-table-column>
            <el-table-column prop="afterPicList" label="维修完成拍照" min-width="160">
              <template slot-scope="scope">
                <el-image @click="bigimg(define.comUrl+item.url)" style="width: 25px;height: 25px;margin-left: 5px;" v-for="item in scope.row.afterPicList" :key="item.fileId" :src="define.comUrl+item.url" :preview-src-list="srcList"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
            <el-table-column prop="createByName" label="创建人" width="120"></el-table-column>
          </JNPF-table>
        </el-dialog>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmsolut" v-if="btnType !== 'look'">提交</el-button>
        </div>
      </el-dialog>
      <ComSelect-page ref="ComSelect-pages" @change="submitfaultLocationName" :tableItems="faultLocationNameItems" title="故障部位" placeholder="请选择故障部位名称" :renderTree="false" :listMethod="parametersShelveslist" :paramsObj="{ index }" :listRequestObj="faultLocationNameRequestObj" :searchList="ProductfaultLocationName" :elementShow="false" />
      <ComSelect-page ref="ComSelect-page" @change="submitCustomerProduct" :tableItems="ProductTableItems" title="故障类型" placeholder="请选择故障类型名称" :renderTree="false" :listMethod="parametersShelveslist" :listRequestObj="ProductListRequestObj" :searchList="ProductTableSearchList" :elementShow="false" multiple />
      <ComSelect-page ref="ComSelect-pagesb" @change="changeWarehouse" :tableItems="ProductTableItemss" title="选择工具" treeTitle="工具分类" :methodArr="{ method: getcategoryTree, requestObj: { classAttribute: 'tool' } }" :listMethod="getEquEquipmentList" :listRequestObj="ProductListRequestObjs" :searchList="ProductTableSearchLists" :elementShow="false" />
      <!-- 备件 -->
      <ComSelect-page ref="ComSelect-sparepart" @change="submitsparepart" :tableItems="sparepartItems" title="备件" placeholder="请选择备件" :renderTree="false" :listMethod="equRequisitionRecordsproducts" :listRequestObj="sparepartRequestObj" :searchList="[]" :elementShow="false" multiple />
    </div>
  </transition>
</template>

<script>
import { getBimBusinessDetail } from '@/api/basicData/index'
import UploadImg from "@/components/Generator/components/Upload/UploadImg.vue";
import { getcategoryTree } from '@/api/basicData/materialSettings'
import { addRepairRequest, updateRepairRequest, detailRepairRequest, equEquipmentRepairKnowledgeList, RepairRequestList, equRequisitionRecordsproducts } from '@/api/dailyManagement/Maintenance'
import { getOrganizeInfo } from '@/api/permission/organize'
import { getEquEquipmentList, parametersShelveslist } from '@/api/basicData/index'
import { getOrganization } from '@/api/permission/user'
import getProjectList from '@/mixins/generator/getProjectList'
import { mapGetters } from 'vuex'
// import { getProductList } from '@/api/basicData/materialFiles' // 产品列表
export default {
  mixins: [getProjectList],
  components: { UploadImg },
  data() {
    return {
      isProjectSwitch: '',
      isApprovalwitch: false,
      sparepartRequestObj: {
        pageNum: 1,
        pageSize: 20,
        workNo: '',
      },
      equRequisitionRecordsproducts,
      sparepartItems: [
        { prop: 'productCode', label: '备件编码' },
        { prop: 'productName', label: '备件名称' },
        { prop: 'drawingNo', label: '品名规格' },
        { prop: 'requisitionNum', label: '领用数量' },
      ],
      statesuc: '',
      isattachmentswitch: '',
      categoryId: '',
      dialogTableVisible: false,
      srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      TablelistLoading: false,
      tableData: [],
      tableDatalist: [],
      listLoading: false,
      dataFormline: {
        solutionMeasures: '',
        knowledgeFlag: false
      },
      outerVisible: false,
      innerVisible: false,
      codeConfig: {},//单据规则配置
      rejectReasonList: [
        { label: '暂不需要维修', value: '暂不需要维修' },
        { label: '待统一维修', value: '待统一维修' },
        { label: '操作工自行解决', value: '操作工自行解决' },
        { label: '其他', value: '其他' }
      ],
      degreeList: [
        { label: '特别紧急', value: '1' },
        { label: '紧急', value: '2' },
        { label: '一般', value: '3' },
        { label: '不急', value: '4' }
      ],
      reviewCommentsList: [
        { label: '立即维修', value: 'immediately' },
        { label: '驳回', value: 'reject' },
        { label: '转委外', value: 'outsourcing' }
      ],
      activeNameinfo: ["lbjInfo"],
      activeNames: ["basicInfo", "gzxx", 'tool', 'bxInfo', 'wxInfo', 'ghlbjxx', 'bxfj'],
      datafilelist: [],
      getcategoryTree,
      ProductTableSearchLists: [
        { prop: "code", label: "工具编码", type: 'input' },
        { prop: "name", label: "工具名称", type: 'input' },
      ],
      ProductListRequestObjs: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "create_time"
          }
        ],
        code: "",
        name: "",
        state: 'normal',
        deviceType: 'normal',
        classAttribute: "tool",
      },
      ProductTableItemss: [
        { prop: 'code', label: '工具编码', fixed: 'left' },
        { prop: 'name', label: '工具名称', fixed: 'left' },
        { prop: 'categoryName', label: '工具分类' },
        { prop: 'specModel', label: '工具规格' },
      ],
      stateList: [
        { label: "待派工", value: "toBeMaintain" },
        { label: "正在维修", value: "maintaining" },
        { label: "已维修", value: "maintained" }
      ],
      formLoading: false,
      dataForms: {
        lines: []
      },
      selectRowsling: [],
      ProductListRequestObj: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ],
        code: "",
        name: "",
        typeCode: "faultType"
      },
      timefaultStartTime: '',
      times: '',
      index: '',
      faultLocationNameRequestObj: {
        pageNum: 1,
        pageSize: 20,
        orderItems: [
          {
            "asc": false,
            "column": ""
          },
          {
            "asc": false,
            "column": "createTime"
          }
        ],
        code: "",
        name: "",
        typeCode: "faultLocation"
      },
      ProductTableSearchList: [
        { prop: "code", label: "故障类型编码", type: 'input' },
        { prop: "name", label: "故障类型名称", type: 'input' },
      ],
      ProductTableItems: [
        { prop: 'code', label: '故障类型编码' },
        { prop: 'name', label: '故障类型名称' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createByName', label: '创建人' },
      ],
      ProductfaultLocationName: [
        { prop: "code", label: "故障部位编码", type: 'input' },
        { prop: "name", label: "故障部位名称", type: 'input' },
      ],
      faultLocationNameItems: [
        { prop: 'code', label: '故障部位编码' },
        { prop: 'name', label: '故障部位名称' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'createByName', label: '创建人' },
      ],
      salesList: [],
      parametersShelveslist,
      getEquEquipmentList,
      dataFormTwo: {
        productData: [],
      },
      btnType: undefined,
      activeName: "orderInfo",
      btnLoading: false,
      formLoading: false,
      dataForm: {
        maintenanceNo: '',
        rejectReason: '',
        frontPicList: [],
        afterPicList: [],
        maintenancePersonnel: '',
        startMaintenanceTime: '',
        repairCompletionTime: '',
        solutionMeasures: '',
        equipmentId: '',
        equipmentIdName: '',
        departmentId: '',
        departmentIdName: '',
        applicantId: '',
        applicantIdName: '',
        applicationDate: '',
        faultStartTime: '',
        remark: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      organizeIdTrees: [],
      productRulesling: {
        num: [
          { validator: this.formValidate({ type: 'noEmtry', params: ["数量不能为空", (errMsg, index) => { this.$message.error(`备件信息第${index + 1}行：${errMsg}`) }] }), trigger: 'blur' },
          { required: true, trigger: 'blur' },
          { validator: this.formValidate('positiveNumber', '数量必须大于0', (errMsg, index) => { this.$message.error(`备件信息第${index + 1}行：${errMsg}`) }), trigger: 'blur' }
        ]
      },
      productRules: {
        faultLocationName: [
          { required: true, trigger: 'change' }
        ],
      },
      dataRuleline: {
        solutionMeasures: [
          { required: true, message: '解决措施不能为空', trigger: 'blur' }
        ]
      },
      dataRule: {
        reason: [
          { required: true, message: '故障原因不能为空', trigger: 'blur' }
        ],
        reviewComments: [
          { required: true, message: '审核意见不能为空', trigger: 'blur' }
        ],
        degree: [
          { required: true, message: '紧急程度不能为空', trigger: 'blur' }
        ],
        startMaintenanceTime: [
          { required: true, message: '派工时间不能为空', trigger: 'blur' }
        ],
        rejectReason: [
          { required: true, message: '驳回理由不能为空', trigger: 'change' }
        ],
        repairCompletionTime: [
          { required: true, message: '维修完成时间不能为空', trigger: 'blur' }
        ],
        solutionMeasures: [
          { required: true, message: '解决措施不能为空', trigger: 'blur' }
        ],
        equipmentId: [
          { required: true, message: '工具不能为空', trigger: 'change' }
        ],
        maintenanceNo: [
          { required: true, message: '维修单号不能为空', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '申请部门不能为空', trigger: 'change' }
        ],
        applicantId: [
          { required: true, message: '申请人不能为空', trigger: 'change' }
        ],
        applicationDate: [
          { required: true, message: '申请时间不能为空', trigger: 'change' }
        ],
        faultStartTime: [
          { required: true, message: '故障开始时间不能为空', trigger: 'change' }
        ],
      },
      selectRows: [],
      inforow: {},
      _index: ''
    }
  },
  async created() {
    await this.getProjectSwitch('system', 'project')
    // this.getSwitch()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    getSwitch() {
      let obj = {
        businessCode: 'maintenance',
        configKey: `gjpg_maintenance`
      }
      getBimBusinessDetail(obj).then(res => {
        this.isApprovalwitch = res.data.configValue1 == '1' ? true : false
      })
    },
    //备件选择
    submitsparepart(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataForms.lines.map((item1) => {
          if (item.id == item1.productId) {
            item.isrepeat = true
          }
        })
      });
      selectedList.map(item => {
        if (!item.isrepeat) {
          this.dataForms.lines.push({
            partName: item.all.productName,
            partCode: item.all.productCode,
            drawingNo: item.all.drawingNo,
            mainUnit: item.all.mainUnit,
            productId: item.all.productId,
            num: '',
          })
        } else {
          this.$message({
            message: "所选备件重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    stateaction(val) {
      this.statesuc = val
    },
    getBimBusinessDetail() {
      let obj = {
        businessCode: 'attachment',
        configKey: 'fj_sbwx'
      }
      getBimBusinessDetail(obj).then(res => {
        this.isattachmentswitch = res.data.configValue1
        this.categoryId = res.data.configValue2
      })
    },
    getTimes(time) {
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt(time / 60 / 60 % 24)
      let m = parseInt(time / 60 % 60)
      let s = parseInt(time % 60)
      return d != '0' ? `${d} 天 ${h} 时 ${m} 分 ${s} 秒` : h != '0' ? `${h} 时 ${m} 分 ${s} 秒` : m != '0' ? `${m} 分 ${s} 秒` : `${s} 秒`
    },
    //查看本工具维修记录
    devicesolutionMeasures() {
      let obj = {
        state: 'maintained',
        classAttribute: "tool",
        equipmentId: this.dataForm.equipmentId,
        pageNum: 1,
        pageSize: -1,
        projectId: this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      }
      this.dialogTableVisible = true
      this.TablelistLoading = true
      RepairRequestList(obj).then(res => {
        this.tableDatalist = res.data.records.map(item => {
          if (item.frontPicList && item.frontPicList.length) {
            item.frontPicList = item.frontPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          if (item.afterPicList && item.afterPicList.length) {
            item.afterPicList = item.afterPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          item.waitDuration = this.getTimes(item.waitDuration)
          item.maintenanceDuration = this.getTimes(item.maintenanceDuration)
          return item
        })
        this.TablelistLoading = false
      }).catch(() => {
        this.TablelistLoading = false
      })
    },
    confirmsolut() {
      this.$refs['dataFormline'].validate((valid) => {
        if (valid) {
          this.$set(this.dataFormTwo.productData[this._index], 'solutionMeasures', this.dataFormline.solutionMeasures)
          this.$set(this.dataFormTwo.productData[this._index], 'knowledgeFlag', this.dataFormline.knowledgeFlag)
          this.outerVisible = false
          this.$message.success('保存成功')
        }
      })
    },
    bigimg(url) {
      this.srcList[0] = url
    },
    solutionMeasuresfun(row, index) {
      this.inforow = row
      this._index = index
      this.dataFormline.solutionMeasures = this.inforow.solutionMeasures
      this.dataFormline.knowledgeFlag = this.inforow.knowledgeFlag
      this.outerVisible = true
    },
    //历史解决措施
    usedsolutionMeasures() {
      let obj = {
        equipmentId: this.dataForm.equipmentId,
        faultTypeCode: this.inforow.faultTypeCode,
        faultLocationCode: this.inforow.faultLocationCode,
        pageNum: 1,
        pageSize: -1,
        projectId: this.isProjectSwitch === '1' ? this.userInfo.projectId || '' : ''
      }
      this.listLoading = true
      equEquipmentRepairKnowledgeList(obj).then(res => {
        this.tableData = res.data.records.map(item => {
          if (item.frontPicList && item.frontPicList.length) {
            item.frontPicList = item.frontPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          if (item.afterPicList && item.afterPicList.length) {
            item.afterPicList = item.afterPicList.map(o => { return JSON.parse(`{${o}}`) })
          }
          return item
        })
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
      this.innerVisible = true
    },
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
      } catch (error) {
      }
    },
    reviewCommentschange(e) {
      if (e == 'reject') return this.dataForm.startMaintenanceTime = ''
      this.dataForm.startMaintenanceTime = this.jnpf.getToday('YYYY-MM-DD HH:mm:ss')
    },
    //零部件信息删除当前行
    deltable(row, index) {
      this.dataForms.lines.splice(row.$index, 1)
    },
    // 零部件批量删除
    batchDeleteling() {
      // 遍历选中的行的数据
      if (!this.selectRowsling.length) {
        this.$message({
          message: '请选择要删除的零部件',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRowsling.length; i++) {
        const row = this.selectRowsling[i];
        const index = this.dataForms.lines.indexOf(row);
        if (index > -1) {
          this.dataForms.lines.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRowsling = []; // 清空选中的行的数据
    },
    //零部件信息新增行
    addtable() {
      this.sparepartRequestObj.workNo = this.dataForm.maintenanceNo
      this.$refs['ComSelect-sparepart'].openDialog()
    },
    //零部件选中
    handeleProductInfoDataling(val) {
      this.selectRowsling = val
    },
    //维修人
    hangleSelectSales(e, r) {
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('maintenancePersonnel')
      })
      this.dataForm.maintenancePersonnel = e
    },
    //故障部位选择
    submitfaultLocationName(selectedIds, selectedList, ind) {
      this.$nextTick(() => {
        this.$refs.productForm.validateField('productData.' + ind.index + '.' + 'faultLocationName')
      })
      this.$set(this.dataFormTwo.productData[ind.index], 'faultLocationName', selectedList[0].all.name)
      this.$set(this.dataFormTwo.productData[ind.index], 'faultLocationCode', selectedList[0].all.code)
    },
    //故障类型选择
    submitCustomerProduct(selectedIds, selectedList) {
      selectedList.map(item => {
        this.dataFormTwo.productData.map((item1) => {
          if (item.all.code == item1.faultTypeCode) {
            item.isrepeat = true
          }
        })
      });
      selectedList.map(item => {
        if (!item.isrepeat) {
          this.dataFormTwo.productData.push({
            faultTypeName: item.all.name,
            faultTypeCode: item.all.code,
            faultLocationName: '',
            faultLocationCode: '',
            faultDescription: '',
            equipmentRepairId: ''
          })
        } else {
          this.$message({
            message: "所选故障类型编码重复",
            type: 'error',
            duration: 1500,
          })
        }
      })
    },
    //故障开始时间
    nextMaintenanceTimeaction(value) {
      this.dataForm.faultStartTime = this.dateFormat(value)
    },
    //维修完成时间
    nextMaintenanceTimeactionwan(value) {
      this.dataForm.repairCompletionTime = this.dateFormat(value)
    },
    //维修开始时间
    nextMaintenanceTimeactionwei(value) {
      this.dataForm.startMaintenanceTime = this.dateFormat(value)
    },
    // 打开故障部位
    openSeleceProductDialogs(index) {
      this.index = index
      this.$refs['ComSelect-pages'].openDialog()
    },
    // 打开故障类型
    openSeleceProductDialog() {
      this.$refs['ComSelect-page'].openDialog()
    },
    openSeleceProductDialogss() {
      this.$refs['ComSelect-pagesb'].openDialog()
    },
    //申请人
    selectsales(val) {
      console.log(val);
      this.dataForm.applicantId = val
    },
    //申请部门
    changedepartment(val) {
      console.log("val,val", val);
      this.dataForm.departmentIdName = ""
      this.dataForm.departmentId = ""
      this.$forceUpdate()
      if (!val || !val.length) return this.dataForm.departmentId = ''
      this.dataForm.departmentId = val[val.length - 1]
      this.$nextTick(() => { this.$refs['dataForm'].validateField('departmentId') })
      getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
        console.log("用户", res);
        if (res.data.length > 0) {
          res.data.forEach(item => {
            item.name = item.fullName.split('/')[0]
          });
        }
        this.salesList = res.data

      })
    },
    //选择工具
    changeWarehouse(val, data) {
      this.$nextTick(() => { this.$refs['dataForm'].validateField('equipmentId') })
      if (!val && !data.length) return
      if (data && data.length) {
        this.dataForm.equipmentId = data[0].id
        this.dataForm.equipmentIdName = data[0].name
      } else {
        this.dataForm.equipmentId = ''
        this.dataForm.equipmentIdName = ''
      }
    },
    //故障开始时间
    dateFormat(dateData) {
      if (!dateData) return
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      var min = date.getMinutes()
      min = min < 10 ? ('0' + min) : min
      var s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      const time = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
      return time
    },
    goBack() {
      this.$emit('close')
    },
    // 产品列表选中 
    handeleProductInfoData(val) {
      console.log(val);
      this.selectRows = val
    },
    // 批量删除
    batchDelete() {
      // 遍历选中的行的数据
      if (!this.selectRows.length) {
        this.$message({
          message: '请选择要删除的产品',
          type: 'error',
          duration: 1500,
        })
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const row = this.selectRows[i];
        const index = this.dataFormTwo.productData.indexOf(row);
        if (index > -1) {
          this.dataFormTwo.productData.splice(index, 1); // 从tableData中删除选中的行
        }
      }
      this.selectRows = []; // 清空选中的行的数据
    },
    // 单个删除
    handleDel(data) {
      console.log("1234", data);
      this.dataFormTwo.productData.splice(data.$index, 1)
    },
    //申请时间
    dateFormattime(dateData) {
      var date = new Date(dateData)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      const time = y + '-' + m + '-' + d
      return time
    },
    // 切换table
    handleClick(tab, event) {
      console.log(tab, event);
    },
    init(id, btnType) {
      this.dataForm.id = id || ''
      this.btnType = btnType
      if (this.btnType === 'start') {
        this.statesuc = 'examine'
      } else if (this.btnType === 'end') {
        this.statesuc = 'repair'
      } else {
        this.statesuc = 'report'
      }
      this.formLoading = true
      this.fetchData('SBWXDH')
      if (this.btnType == 'add') {
        const end = new Date();//获取当前的日期
        end.setTime(end.getTime())
        this.dataForm.applicationDate = this.dateFormattime(end)
        this.dataForm.faultStartTime = this.dateFormat(end)
        this.formLoading = false
      }
      if (this.dataForm.id) {
        detailRepairRequest(this.dataForm.id).then(res => {
          if (res.data.repair.afterPic && res.data.repair.afterPicList.length) {
            res.data.repair.afterPicList = res.data.repair.afterPicList.map(item => {
              return JSON.parse(`{${item}}`)
            })
          } else {
            res.data.repair.afterPicList = []
          }
          if (res.data.repair.frontPic && res.data.repair.frontPicList.length) {
            res.data.repair.frontPicList = res.data.repair.frontPicList.map(item => {
              return JSON.parse(`{${item}}`)
            })
          } else {
            res.data.repair.frontPicList = []
          }
          this.dataForm = res.data.repair
          this.dataForms.lines = res.data.equLine
          this.dataFormTwo.productData = res.data.lines
          if (res.data.attachmentList) {
            res.data.attachmentList.forEach((item) => {
              this.datafilelist.push(
                {
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                }
              )
            })
          }
          if (this.btnType == 'start') {
            const end = new Date();//获取当前的日期
            end.setTime(end.getTime())
            this.dataForm.startMaintenanceTime = this.dateFormat(end)
            this.timefaultStartTime = Date.parse(res.data.repair.faultStartTime)
          }
          if (this.btnType == 'end') {
            this.times = Date.parse(res.data.repair.startMaintenanceTime)
            // this.times = new Date(res.data.repair.startMaintenanceTime).getTime()
          }
          this.formLoading = false
          this.$nextTick(() => {
            if (this.dataForm.departmentId) {
              this.formLoading = true
              let requestSuccessTotal = 0
              getOrganizeInfo(this.dataForm.departmentId).then(sss => {
                this.organizeIdTrees = sss.data.organizeIdTree || []
                this.organizeIdTrees.push(this.dataForm.departmentId)
                if (++requestSuccessTotal === 2) this.formLoading = false
              })
              getOrganization({ keyword: "", organizeId: this.dataForm.departmentId }).then(res => {
                if (res.data.length > 0) {
                  res.data.forEach(item => {
                    item.name = item.fullName.split('/')[0]
                  });
                }
                this.salesList = res.data
                if (++requestSuccessTotal === 2) this.formLoading = false
              })
            } else {
              this.salesFlag = true
            }
          })
        })
      }
    },
    async handleConfirm(value) {
      let submitFlag = false
      let valid_2
      let valid_1 = await this.$refs.dataForm.validate().catch(err => false)
      if (!valid_1) {
        // this.activeName = "orderInfo",
        submitFlag = true
      }
      if (!this.dataFormTwo.productData.length) {
        submitFlag = true
        this.$message({
          message: '请添加故障类型',
          type: 'error',
          duration: 1500,
        })
      } else {
        // this.dataFormTwo.productData.map((item, index) => {
        //   if (!item.faultLocationName) {
        //     // this.activeName = "orderInfo",
        //       this.$message.error(`第${index + 1}行故障部位名称不能为空`)
        //     submitFlag = true
        //     return
        //   }
        // })
        // valid_2 = await this.$refs.productForm.validate().catch(err => false)
      }
      // if (!valid_2) return submitFlag = true
      if (['look', 'end'].includes(this.btnType)) {
        let valid_3 = await this.$refs.productForms.validate().catch(err => false)
        if (!valid_3) {
          // this.activeName = "replacecomponents",
          this.$message.error('更换零部件信息请填写完整')
          submitFlag = true
          return
        }
      }
      if (submitFlag) return submitFlag = false
      let fault = Date.parse(this.dataForm.faultStartTime)
      let start = Date.parse(this.dataForm.startMaintenanceTime)
      let end = Date.parse(this.dataForm.repairCompletionTime)
      if (this.btnType == 'start' && fault > start) return this.$message.error('派工时间不能小于故障开始时间')
      if (this.btnType == 'end' && start > end) return this.$message.error('维修完成时间不能小于派工时间')
      this.dataForm.documentStatus = value
      if (this.datafilelist.length) {
        this.datafilelist.map((item, index) => {
          item.bimAttachments = {
            businessType: '',
            documentId: item.id,
            fileFlag: '',
            sort: index
          }
        })
      }
      this.dataForm.afterPicList = Array.isArray(this.dataForm.afterPicList) ?
        this.dataForm.afterPicList.map(item => {
          return JSON.stringify(item)
            .replace("{", "")
            .replace("}", "")
        }) : []
      this.dataForm.frontPicList = Array.isArray(this.dataForm.frontPicList) ?
        this.dataForm.frontPicList.map(item => {
          return JSON.stringify(item)
            .replace("{", "")
            .replace("}", "")
        }) : []
      let obj = {
        attachmentList: this.datafilelist,
        equLine: this.dataForms.lines,
        repair: this.dataForm,
        lines: this.dataFormTwo.productData
      }
      this.btnLoading = true
      let formMethod = null;
      if (this.btnType == 'edit' || this.btnType == 'start' || this.btnType == 'end') {
        formMethod = updateRepairRequest
      } else if (this.btnType == 'add') {
        formMethod = addRepairRequest
      }
      formMethod(obj).then(res => {
        let msg = "";
        if (formMethod == addRepairRequest) {
          msg = "新建成功"
        } else if (value == 'draft') {
          msg = "保存成功"
        } else if (value == 'submit') {
          msg = '提交成功'
        }
        this.$emit('close', true)
        this.$message({
          message: msg,
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.btnLoading = false
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
      // }
    }
  }
}
</script>
<style scoped lang="scss">
.stage-state {
  .button-info {
    width: calc(33.3% - 14px);
    border: none;
    background-color: #fff;
    padding: 0 !important;
  }
  v-deep .el-button:focus,
  .el-button:hover {
    background-color: #fff;
  }
  v-deep .el-button:active {
    background-color: #fff;
  }
  position: relative;
  z-index: 1;
  flex-wrap: wrap;
  padding: 10px 0;
  // overflow-x: auto;
  justify-content: start;
  a {
    flex-shrink: 0;
    background-color: transparent;
    &:last-child {
      .stage-state-item {
        margin-right: 32px;
      }
    }
  }
  .stage-state-item {
    position: relative;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-width: 120px;
    height: 66px;
    padding: 0 8px;
    margin-right: 8px;
    line-height: 66px;
    .state-arrow {
      position: absolute;
      width: 66px;
      height: 66px;
      transform: scale(0.707) rotate(45deg);
    }
    .arrow-left {
      top: 0;
      left: -32px;
    }
    .arrow-right {
      top: 0;
      right: -32px;
      z-index: 1;
    }
    .stage-name {
      text-align: center;
      font-size: 24px;
      flex: 1;
    }
    .text-one-ellipsis {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .stage-value {
      z-index: 2;
      flex-shrink: 0;
      padding-left: 4px;
    }
  }
  .stage-state-item.is-center {
    padding-left: 16px;
  }
  .state-suc {
    color: #fff !important;
    background-color: #0065ff !important;
  }
  .state-undo {
    background-color: #f4f5f7;
    .state-arrow {
      background-color: #fff;
    }
    .arrow-right {
      background-color: #f4f5f7;
    }
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 5px;
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
::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
  padding-right: 0 !important;
}
::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
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
  padding-bottom: 0px;
}
::v-deep .JNPF-common-page-header {
  padding: 5px 10px !important;
}
</style>
    