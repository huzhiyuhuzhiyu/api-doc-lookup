<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!onlyRead"/> -->
        <el-page-header @back="goBack" :content="onlyRead ? '查看员工信息' : !this.dataForm.id ? '新建员工' : '编辑员工信息'" />
        <div class="options">
          <el-button size="mini" type="primary" v-if="!onlyRead" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton') }}</el-button>
          <el-button size="mini" @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="个人信息" name="account">
            <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="160px" label-position="top">
              <el-collapse v-model="activeNames">
                <el-collapse-item title="基本信息" name="basicInfo">
                  <el-row :gutter="30" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="头像" prop="photo">
                        <el-upload class="avatar-uploader" :headers="uploadHeaders" :disabled="onlyRead" placeholder="上传头像" :action="define.comUploadUrl + '/userAvatar'" :show-file-list="false" :on-success="handleAvatarSuccess" accept="image/*">
                          <img v-if="dataForm.photo" :src="define.comUrl + dataForm.photo" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon" />
                        </el-upload>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="工号" prop="jobNumber">
                        <el-input v-model="dataForm.jobNumber" placeholder="请输入工号" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入姓名" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="性别" prop="sex" style="width: 100%;">
                        <el-select v-model="dataForm.sex" placeholder="请选择性别" :disabled="onlyRead" style="width: 100%;">
                          <el-option v-for="item in genderTreeData" :key="item.id" :label="item.fullName" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="部门" prop="organizeIdTree" ref="organizeIdTree">
                        <ComSelect v-model="dataForm.organizeIdTree" placeholder="请选择部门" :disabled="onlyRead || !!this.dataForm.id" multiple @change="onOrganizeChange" clearable auth />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="岗位" prop="postId" ref="positionId">
                        <el-select v-model="positionId" placeholder="请选择岗位" :disabled="onlyRead || !!this.dataForm.id" style="width: 100%;" @change="onChange('postId')" @visible-change="visibleChange" multiple filterable clearable>
                          <el-option-group v-for="group in positionTreeData" :key="group.id" :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                            <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName" :value="item.id">
                            </el-option>
                          </el-option-group>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="直属主管" prop="managerId">
                        <user-select v-model="dataForm.managerId" placeholder="请选择直属主管" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker v-model="dataForm.birthday" type="date" :disabled="onlyRead" placeholder="请选择出生日期" style="width: 100%;" value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="籍贯" prop="nativePlace">
                        <el-input v-model="dataForm.nativePlace" :disabled="onlyRead" placeholder="请输入籍贯" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="民族" prop="nation">
                        <el-select v-model="dataForm.nation" :disabled="onlyRead" placeholder="请选择民族" filterable style="width: 100%;">
                          <el-option v-for="item in nationTreeData" :key="item.id" :label="item.fullName" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="政治面貌" prop="politicalOutlook">
                        <el-input v-model="dataForm.politicalOutlook" :disabled="onlyRead" placeholder="请输入政治面貌" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="学历" prop="education">
                        <el-select v-model="dataForm.education" :disabled="onlyRead" placeholder="请选择学历" style="width: 100%;">
                          <el-option v-for="item in educationTreeData" :key="item.id" :label="item.fullName" :value="item.id" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="健康状况" prop="health">
                        <el-input v-model="dataForm.health" :disabled="onlyRead" placeholder="请输入健康状况" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="婚姻状况" prop="maritalStatus">
                        <el-select v-model="dataForm.maritalStatus" placeholder="请选择婚姻状况" style="width: 100%;" :disabled="onlyRead">
                          <el-option label="未婚" value="未婚" />
                          <el-option label="已婚" value="已婚" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="有无刑事记录" prop="criminalRecords" style="width: 100%;">
                        <el-select v-model="dataForm.criminalRecords" placeholder="请选择有无刑事记录" :disabled="onlyRead" style="width: 100%;">
                          <el-option label="无" value=0 />
                          <el-option label="有" value=1 />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="有无传染病或职业病史" prop="infectiousDisease" style="width: 100%;">
                        <el-select v-model="dataForm.infectiousDisease" placeholder="请选择有无传染病或职业病史" :disabled="onlyRead" style="width: 100%;">
                          <el-option label="无" value=0 />
                          <el-option label="有" value=1 />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="驾照类型" prop="driverLicenseType">
                        <el-input v-model="dataForm.driverLicenseType" :disabled="onlyRead" placeholder="请输入驾照类型" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="驾照职称" prop="driverLicenseGrade">
                        <el-input v-model="dataForm.driverLicenseGrade" :disabled="onlyRead" placeholder="请输入驾照职称" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="语言能力" prop="languageProficiency">
                        <el-input v-model="dataForm.languageProficiency" :disabled="onlyRead" placeholder="请输入语言能力" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="爱好" prop="hobby">
                        <el-input v-model="dataForm.hobby" :disabled="onlyRead" placeholder="请输入爱好" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="特长" prop="speciality">
                        <el-input v-model="dataForm.speciality" :disabled="onlyRead" placeholder="请输入特长" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="身份证号码" prop="idCardNo">
                        <el-input v-model="dataForm.idCardNo" :disabled="onlyRead" placeholder="请输入身份证号码" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="dataForm.email" placeholder="请输入电子邮箱" maxlength="50" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="户口所在地" prop="registeredResidence">
                        <el-input v-model="dataForm.registeredResidence" placeholder="请输入户口所在地" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="户籍性质" prop="registeredResidenceNature">
                        <el-input v-model="dataForm.registeredResidenceNature" placeholder="请输入户籍性质" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="手机号码" prop="mobileNumber">
                        <el-input v-model="dataForm.mobileNumber" :disabled="onlyRead" placeholder="请输入手机号码" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="居住地址" prop="residentialAddress">
                        <el-input v-model="dataForm.residentialAddress" placeholder="请输入居住地址" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="家庭固定电话" prop="homeLandlineTelephone">
                        <el-input v-model="dataForm.homeLandlineTelephone" placeholder="请输入家庭固定电话" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="紧急联系人" prop="emergencyContact">
                        <el-input v-model="dataForm.emergencyContact" :disabled="onlyRead" placeholder="请输入紧急联系人" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="与你关系" prop="youRelationship">
                        <el-input v-model="dataForm.youRelationship" :disabled="onlyRead" placeholder="请输入与你关系" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="紧急联系人电话" prop="emergencyPhoneNumber">
                        <el-input v-model="dataForm.urgentTelePhone" :disabled="onlyRead" placeholder="请输入紧急联系人电话" maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="开户银行" prop="bank">
                        <el-input v-model="dataForm.bank" placeholder="请输入开户银行" maxlength="20" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="银行卡号" prop="bankinfo">
                        <el-input v-model="dataForm.bankinfo" placeholder="请输入银行卡号" maxlength="30" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="员工类型" prop="employeeType">
                        <el-select v-model="dataForm.employeeType" placeholder="请选择员工类型" clearable style="width: 100%;" :disabled="onlyRead">
                          <el-option v-for="item in employeeTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="员工状态" prop="employeeStatus" ref="employeeStatus">
                        <el-select v-model="dataForm.employeeStatus" placeholder="请选择员工状态" style="width: 100%;" :disabled="onlyRead || !!this.dataForm.id">
                          <el-option label="在职" value="on_job" />
                          <el-option label="离职" value="off_job" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="离职日期" prop="resignationDate">
                        <el-date-picker v-model="dataForm.resignationDate" type="date" :disabled="onlyRead || dataForm.employeeStatus == 'on_job'" placeholder="请选择离职日期" style="width: 100%;" value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="合同开始日期" prop="contractStartDate">
                        <el-date-picker v-model="dataForm.contractStartDate" type="date" :disabled="onlyRead" placeholder="请选择合同开始日期" style="width: 100%;" value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="合同结束日期" prop="contractEndDate">
                        <el-date-picker v-model="dataForm.contractEndDate" type="date" :disabled="onlyRead" placeholder="请选择合同结束日期" style="width: 100%;" value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="社保起交日期" prop="socialSecurityStartDate">
                        <el-date-picker v-model="dataForm.socialSecurityStartDate" type="date" :disabled="onlyRead" placeholder="请选择社保起交日期" style="width: 100%;" value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="社保断交日期" prop="socialSecurityEndDate">
                        <el-date-picker v-model="dataForm.socialSecurityEndDate" type="date" :disabled="onlyRead" placeholder="请选择社保断交日期" style="width: 100%;" value-format="yyyy-MM-dd">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="自我评价及主要业绩描述" prop="selfEvaluation">
                        <el-input v-model="dataForm.selfEvaluation" type="textarea" :rows="3" placeholder="请输入" maxlength="200" :disabled="onlyRead" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-collapse-item>
              </el-collapse>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="教育经历" name="jyjl">
            <el-table :data="contactsList" style="width: 100%">
              <el-table-column prop="startDate" label="开始日期" min-width="180">
                <template slot="header">
                  <span class="required">*</span>开始日期
                </template>
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.startDate" type="date" :disabled="onlyRead" placeholder="请选择开始日期" style="width: 100%;" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="endDate" label="结束日期" min-width="180">
                <template slot="header">
                  <span class="required">*</span>结束日期
                </template>
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.endDate" type="date" :disabled="onlyRead" placeholder="请选择结束日期" style="width: 100%;" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="studyInstitutions" label="学习院校/培训机构" min-width="200">
                <template slot="header">
                  <span class="required">*</span>学习院校/培训机构
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.studyInstitutions" :disabled="onlyRead" maxlength="200" placeholder="请输入学习院校/培训机构">{{
                      scope.row.studyInstitutions }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="certificate" label="专业/证书名称" min-width="200">
                <template slot="header">
                  <span class="required">*</span>专业/证书名称
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.certificate" :disabled="onlyRead" maxlength="200" placeholder="请输入专业/证书名称">{{
                      scope.row.certificate }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button @click="deltable(scope)" v-if="btnType!=='look'" type="text" style="color:rgb(245,108,108)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="addtable()" v-if="btnType!=='look'">
              <el-button type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工作经历" name="gzjl">
            <el-table :data="workList" style="width: 100%">
              <el-table-column prop="startDate" label="开始日期" min-width="180">
                <template slot="header">
                  <span class="required">*</span>开始日期
                </template>
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.startDate" type="date" :disabled="onlyRead" placeholder="请选择开始日期" style="width: 100%;" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="endDate" label="结束日期" min-width="180">
                <template slot="header">
                  <span class="required">*</span>结束日期
                </template>
                <template slot-scope="scope">
                  <el-date-picker v-model="scope.row.endDate" type="date" :disabled="onlyRead" placeholder="请选择结束日期" style="width: 100%;" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="companyName" label="工作单位及部门" min-width="220">
                <template slot="header">
                  <span class="required">*</span>工作单位及部门
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.companyName" :disabled="onlyRead" maxlength="300" placeholder="请输入工作单位及部门">{{
                      scope.row.companyName }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="post" label="职务" min-width="200">
                <template slot="header">
                  <span class="required">*</span>职务
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.post" :disabled="onlyRead" maxlength="50" placeholder="请输入职务">{{
                      scope.row.post }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="salary" label="薪资" min-width="180">
                <template slot="header">
                  <span class="required">*</span>薪资
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.salary" :disabled="onlyRead" maxlength="20" placeholder="请输入薪资">{{
                      scope.row.salary }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="reasonLeaving" label="离职原因" min-width="230">
                <template slot="header">
                  <span class="required">*</span>离职原因
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.reasonLeaving" :disabled="onlyRead" maxlength="50" placeholder="请输入离职原因">{{
                      scope.row.reasonLeaving }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button @click="deltablegzjl(scope)" v-if="btnType!=='look'" type="text" style="color:rgb(245,108,108)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="addtablegzjl()" v-if="btnType!=='look'">
              <el-button type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="家庭成员" name="jtcy">
            <el-table :data="memberfamilyList" style="width: 100%">
              <el-table-column prop="name" label="姓名" min-width="120">
                <template slot="header">
                  <span class="required">*</span>姓名
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" :disabled="onlyRead" maxlength="20" placeholder="请输入姓名">{{
                      scope.row.name }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="age" label="年龄" min-width="90">
                <template slot="header">
                  <span class="required">*</span>年龄
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.age" :disabled="onlyRead" placeholder="请输入年龄">{{
                      scope.row.age }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="relationship" label="关系" min-width="160">
                <template slot="header">
                  <span class="required">*</span>关系
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.relationship" :disabled="onlyRead" maxlength="20" placeholder="请输入关系">{{
                      scope.row.relationship }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="companyName" label="工作单位及职务" min-width="220">
                <template slot="header">
                  <span class="required">*</span>工作单位及职务
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.companyName" :disabled="onlyRead" maxlength="300" placeholder="请输入工作单位及职务">{{
                      scope.row.companyName }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="tel" label="联系电话" min-width="200">
                <template slot="header">
                  <span class="required">*</span>联系电话
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.tel" :disabled="onlyRead" maxlength="50" placeholder="请输入联系电话">{{
                      scope.row.tel }}
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <el-button @click="deltablejtcy(scope)" v-if="btnType!=='look'" type="text" style="color:rgb(245,108,108)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-actions" @click="addtablejtcy()" v-if="btnType!=='look'">
              <el-button type="text" icon="el-icon-plus">添加</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { getPositionByOrganize } from '@/api/permission/position'
import { getRoleByOrganize } from '@/api/permission/role'
import { getGroupSelector } from '@/api/permission/group'
import { addbaseEmployee, updatebaseEmployee, getbaseEmployeeInfo } from '@/api/permission/user'
import moment from 'moment'

export default {
  data() {
    return {
      activeNames: ["basicInfo"],
      memberfamilyList: [],
      workList: [],
      contactsList: [],
      visible: false,
      btnLoading: false,
      dataForm: {
        id: '',
        jobNumber: '', //工号
        name: '',//姓名
        sex: null, //性别
        organizeIdTree: [], //组织id树
        postId: '', //岗位id
        managerId: '', //直属主管
        birthday: '', //出生日期
        nativePlace: '', //籍贯
        employeeStatus: 'on_job', //员工状态
        employeeType: '', //员工类型
        nation: '', //民族
        politicalOutlook: '', //政治面貌
        education: '', //学历
        health: '', //健康状况
        maritalStatus: '',//婚姻状况
        criminalRecords: '', //有无刑事记录
        infectiousDisease: '', //有无传染病或职业病史
        driverLicenseType: '', //驾照类型
        driverLicenseGrade: '', //驾照职称
        languageProficiency: '', //语言能力
        hobby: '', //爱好
        speciality: '', //特长
        idCardNo: '', //身份证号码
        email: '', //电子邮箱
        registeredResidence: '', //户口所在地
        registeredResidenceNature: '', //户籍性质
        mobileNumber: '', //手机号码
        residentialAddress: '', //居住地址
        homeLandlineTelephone: '', //家庭固定电话
        emergencyContact: '', //紧急联系人
        youRelationship: '', //与你关系
        photo: '', //员工头像
        emergencyPhoneNumber: '', //紧急联系人电话
        bank: '', //开户银行
        bankinfo: '', //银行卡号
        resignationDate: '', //离职日期
        contractStartDate: '', //合同开始日期
        contractEndDate: '', //合同结束日期
        socialSecurityStartDate: '', //社保起交日期
        socialSecurityEndDate: '', //社保断交日期
        selfEvaluation: '', //自我评价及主要业绩描述
      },
      positionId: [],
      positionTreeData: [],
      roleTreeData: [],
      groupTreeData: [],
      genderTreeData: [],
      nationTreeData: [],
      educationTreeData: [],
      certificatesTypeTreeData: [],
      uploadHeaders: { Authorization: this.$store.getters.token },
      formLoading: false,
      onlyRead: false,
      activeName: 'account',
      employeeTypeList: [{ label: "劳务派遣", value: "labor_dispatch" }, { label: "正式员工", value: "formal" }, { label: "兼职", value: "sideline" }, { label: "实习", value: "pratice" }, { label: "试用", value: "trial" }, { label: "学徒", value: "apprentice" }],
      employeeStatusList: [{ label: "在职", value: "on_job" }, { label: "离职", value: "off_job" }],
      rules: {
        jobNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { validator: this.formValidate('fullName', '工号不能含有特殊符号'), trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: this.formValidate('fullName', '真实姓名不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '真实姓名最多为50个字符！', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        organizeIdTree: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        postId: [
          { required: true, message: '请选择所属岗位', trigger: 'change' }
        ],
        employeeStatus: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ],
        mobileNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.formValidate('iphone'), trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    // 教育经历信息删除当前行
    deltable(row, index) {
      this.contactsList.splice(row.$index, 1)
    },
    // 工作经历信息删除当前行
    deltablegzjl(row, index) {
      this.workList.splice(row.$index, 1)
    },
    // 家庭成员信息删除当前行
    deltablejtcy(row, index) {
      this.memberfamilyList.splice(row.$index, 1)
    },
    // 教育经历新增行
    addtable() {
      this.contactsList.push({
        startDate: '',
        endDate: '',
        studyInstitutions: "",
        certificate: ""
      })
    },
    // 工作经历新增行
    addtablegzjl() {
      this.workList.push({
        startDate: '',
        endDate: '',
        companyName: "",
        post: "",
        salary: "",
        reasonLeaving: ""
      })
    },
    // 家庭成员新增行
    addtablejtcy() {
      this.memberfamilyList.push({
        name: '',
        age: '',
        relationship: "",
        companyName: "",
        tel: ""
      })
    },
    init(id, type, onlyRead) {
      this.visible = true
      this.dataForm.id = id || ''
      this.onlyRead = onlyRead
      this.positionId = []
      this.dataForm.organizeIdTree = []
      this.$nextTick(() => {
        this.formLoading = true
        this.$refs['dataForm'].resetFields()
        // 获取分组下拉列表
        getGroupSelector().then(res => {
          this.groupTreeData = res.data
        })
        // 获取民族
        this.$store.dispatch('base/getDictionaryData', { sort: 'Nation' }).then(res => {
          this.nationTreeData = res
          // 获取学历
          this.$store.dispatch('base/getDictionaryData', { sort: 'Education' }).then(res => {
            this.educationTreeData = res
          })
          // // 获取证件类型
          // this.$store.dispatch('base/getDictionaryData', { sort: 'certificateType' }).then(res => {
          //   this.certificatesTypeTreeData = res
          // })
          // 获取性别
          this.$store.dispatch('base/getDictionaryData', { sort: 'sex' }).then(res => {
            this.genderTreeData = res
          })
        })
        if (this.dataForm.id) {
          getbaseEmployeeInfo(this.dataForm.id).then(res => {
            this.memberfamilyList = res.data.familyMembers
            this.workList = res.data.workExperience
            this.contactsList = res.data.educationalExperience
            this.dataForm = res.data.employeeVO
            if (this.dataForm.postId) this.positionId = this.dataForm.postId.split(',')
            if (this.dataForm.organizeIdTree && this.dataForm.organizeIdTree.length) {
              this.getOptionsByOrgIds(this.dataForm.organizeIdTree)
            }
            if (res.data.employeeStatus === "off_job") {
              this.rules.employeeStatus[0].required = false
              this.rules.postId[0].required = false
              this.rules.organizeIdTree[0].required = false
            }
            this.formLoading = false
          }).catch(() => this.formLoading = false)
        } else {
          this.formLoading = false
        }
      })
    },
    goBack() {
      this.$emit('close')
    },
    onChange(key) {
      this.dataForm[key] = this.positionId.join()
    },
    onOrganizeChange(val) {
      this.dataForm.postId = ''
      this.dataForm.roleId = ''
      this.dataForm.departmentId = ''
      this.positionId = []
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate(['organizeIdTree']);
        this.$refs.dataForm.clearValidate(['positionId']);
      })
      if (!val || !val.length) return
      this.getOptionsByOrgIds(val)
    },
    getOptionsByOrgIds(organizeIdTree) {
      const organizeIds = organizeIdTree.map(o => o[o.length - 1])
      this.dataForm.departmentId = organizeIds.join()
      getPositionByOrganize(organizeIds).then(res => {
        this.positionTreeData = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
      getRoleByOrganize(organizeIds).then(res => {
        this.roleTreeData = res.data.list.filter(o => o.children && Array.isArray(o.children) && o.children.length)
      })
    },
    visibleChange(val) {
      if (!val) return
      if (!this.dataForm.organizeIdTree || !this.dataForm.organizeIdTree.length) {
        this.positionTreeData = []
        this.postId = []
        this.$message.warning('请先选择部门')
      }
    },
    handleAvatarSuccess(res) {
      if (res.code === 200 && res.data && res.data.url) {
        this.dataForm.photo = res.data.url
      } else {
        this.$message.error('头像上传失败');
      }
    },
    handleConfirm() {
      let flag = null;
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.contactsList.forEach((item, index) => {
            if (!item.startDate) {
              flag = false
              this.activeName = "jyjl"
              return this.$message({
                message: `请填写第${index + 1}行开始日期`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.endDate) {
              this.activeName = "jyjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行结束日期`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.studyInstitutions) {
              this.activeName = "jyjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行学习院校/培训机构`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.certificate) {
              this.activeName = "jyjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行专业/证书名称`,
                type: 'error',
                duration: 1500,
              })
            }
          });
          this.workList.forEach((item, index) => {
            if (!item.startDate) {
              flag = false
              this.activeName = "gzjl"
              return this.$message({
                message: `请填写第${index + 1}行开始日期`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.endDate) {
              this.activeName = "gzjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行结束日期`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.companyName) {
              this.activeName = "gzjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行工作单位及部门`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.post) {
              this.activeName = "gzjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行职务`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.salary) {
              this.activeName = "gzjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行薪资`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.reasonLeaving) {
              this.activeName = "gzjl"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行离职原因`,
                type: 'error',
                duration: 1500,
              })
            }
          });
          this.memberfamilyList.forEach((item, index) => {
            if (!item.name) {
              flag = false
              this.activeName = "jtcy"
              return this.$message({
                message: `请填写第${index + 1}行姓名`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.age) {
              this.activeName = "jtcy"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行年龄`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.relationship) {
              this.activeName = "jtcy"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行关系`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.companyName) {
              this.activeName = "jtcy"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行工作单位及职务`,
                type: 'error',
                duration: 1500,
              })
            } else if (!item.tel) {
              this.activeName = "jtcy"
              flag = false
              return this.$message({
                message: `请填写第${index + 1}行联系电话`,
                type: 'error',
                duration: 1500,
              })
            }
          });
          // if (this.datafilelist.length) {
          //   this.datafilelist.map((item, index) => {
          //     item.bimAttachments = {
          //       businessType: 'customer',
          //       documentId: item.id,
          //       fileFlag: '',
          //       sort: index
          //     }
          //   })
          // }
          let obj = {
            educationalExperience: this.contactsList,
            employee: this.dataForm,
            familyMembers: this.memberfamilyList,
            workExperience: this.workList
          }
          if (flag === false) return
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updatebaseEmployee : addbaseEmployee
          formMethod(obj).then(res => {
            let msg = "";
            if (formMethod == updatebaseEmployee) {
              msg = "修改成功"
            } else {
              msg = "新建成功"
            }
            this.$message({
              message: msg,
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          this.activeName = "account"
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
>>> .avatar-uploader {
  .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}

.avatar {
  width: 130px;
  height: 130px;
  display: block;
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
::v-deep .el-tabs__header {
  padding: 0 !important;
}
</style>
<style scoped>
::v-deep .el-tabs__content {
  height: auto !important;
  /* padding: 0 20px; */
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
</style>