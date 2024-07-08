<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <!-- <el-page-header @back="goBack" :content="!parentId ? $t(`customer.addCustomer`) : $t(`customer.editCustomer`)" v-show="!onlyRead"/> -->
        <el-page-header @back="goBack" :content="onlyRead ? '查看用户信息' : !this.dataForm.id ? '新建用户' : '编辑用户信息'" />
        <div class="options">
          <el-button type="primary"  v-if="!onlyRead" :loading="btnLoading" @click="handleConfirm()">{{ $t('common.submitButton') }}</el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="账户信息" name="account">
            <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="账户" prop="account" ref="account">
                    <el-input v-model="dataForm.account" placeholder="请输入账户" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="工号" prop="jobNumber">
                    <el-input v-model="dataForm.jobNumber" placeholder="请输入工号" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="姓名" prop="realName" ref="realName">
                    <el-input v-model="dataForm.realName" placeholder="请输入姓名" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="性别" prop="gender" style="width: 100%;" ref="gender">
                    <el-select v-model="dataForm.gender" placeholder="请选择性别" :disabled="onlyRead" style="width: 100%;">
                      <el-option v-for="item in genderTreeData" :key="item.enCode" :label="item.fullName"
                        :value="item.enCode" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="dataForm.email" placeholder="请输入电子邮箱" maxlength="50" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="通讯地址" prop="postalAddress">
                    <el-input v-model="dataForm.postalAddress" placeholder="请输入通讯地址" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="24" :xs="24" style="padding:0">

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="所属组织" prop="organizeIdTree" ref="organizeIdTree">
                      <ComSelect v-model="dataForm.organizeIdTree" placeholder="请选择所属组织"
                        :disabled="onlyRead || !!this.dataForm.id" multiple @change="onOrganizeChange" clearable auth />
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="岗位" prop="positionId" ref="positionId">
                      <el-select v-model="positionId" placeholder="请选择岗位" :disabled="onlyRead || !!this.dataForm.id"
                        style="width: 100%;" @change="onChange('positionId')" @visible-change="visibleChange" multiple
                        filterable clearable>
                        <el-option-group v-for="group in positionTreeData" :key="group.id"
                          :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                          <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                            :value="item.id">
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :sm="8" :xs="24">
                    <el-form-item label="角色" prop="roleId">
                      <el-select v-model="roleId" placeholder="请选择角色" :disabled="onlyRead" @change="onChange('roleId')"
                        style="width: 100%;" @visible-change="visibleChange" multiple filterable clearable>
                        <el-option-group v-for="group in roleTreeData" :key="group.id"
                          :label="group.fullName + (group.num ? '【' + group.num + '】' : '')">
                          <el-option v-for="item in group.children" :key="group.id + item.id" :label="item.fullName"
                            :value="item.id">
                          </el-option>
                        </el-option-group>
                      </el-select>
                    </el-form-item>
                  </el-col>

                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="职务" prop="jobId">
                    <el-input v-model="dataForm.jobId" placeholder="请输入职务" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="直属主管" prop="managerId">
                    <user-select v-model="dataForm.managerId" placeholder="请选择直属主管" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="状态" prop="enabledMark">
                    <el-select v-model="dataForm.enabledMark" placeholder="请选择状态" :disabled="onlyRead"
                      style="width: 100%;">
                      <el-option label="启用" :value="1" />
                      <el-option label="锁定" :value="2" />
                      <el-option label="禁用" :value="0" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="开户银行" prop="bank">
                    <el-input v-model="dataForm.bank" placeholder="请输入开户银行" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="银行卡号" prop="bankinfo">
                    <el-input v-model="dataForm.bankinfo" placeholder="请输入银行卡号" maxlength="30" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="考核等级" prop="awardGradeId">
                    <el-input v-model="dataForm.awardGradeId" placeholder="请输入考核等级" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="荣誉" prop="honourId">
                    <el-input v-model="dataForm.honourId" placeholder="请输入荣誉" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="员工类型" prop="emloyeeType">
                    <el-select v-model="dataForm.employeeType" placeholder="请选择员工类型" clearable style="width: 100%;"
                      :disabled="onlyRead">
                      <el-option v-for="item in employeeTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="员工状态" prop="employeeStatus" ref="employeeStatus">
                    <el-select v-model="dataForm.employeeStatus" placeholder="请选择员工状态" style="width: 100%;"
                      :disabled="onlyRead || !!this.dataForm.id">
                      <!-- :disabled="onlyRead ? true : !this.dataForm.id ? false : true" style="width: 100%;"> -->
                      <el-option label="在职" value="on_job" />
                      <el-option label="离职" value="off_job" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="入职日期" prop="entryDate">
                    <el-date-picker v-model="dataForm.entryDate" type="date" :disabled="onlyRead" placeholder="请选择入职日期"
                      style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="婚姻状况" prop="maritalStatus">
                    <el-select v-model="dataForm.maritalStatus" placeholder="请选择婚姻状况" style="width: 100%;"
                      :disabled="onlyRead">
                      <el-option label="未婚" value="unmarried" />
                      <el-option label="已婚" value="married" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="离职日期" prop="resignationDate">
                    <el-date-picker v-model="dataForm.resignationDate" type="date"
                      :disabled="onlyRead || dataForm.employeeStatus == 'on_job'" placeholder="请选择离职日期"
                      style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="合同开始日期" prop="contractStartDate">
                    <el-date-picker v-model="dataForm.contractStartDate" type="date" :disabled="onlyRead"
                      placeholder="请选择合同开始日期" style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="合同结束日期" prop="contractEndDate">
                    <el-date-picker v-model="dataForm.contractEndDate" type="date" :disabled="onlyRead"
                      placeholder="请选择合同结束日期" style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :sm="8" :xs="24">
                  <el-form-item label="社保起交日期" prop="socialSecurityStartDate">
                    <el-date-picker v-model="dataForm.socialSecurityStartDate" type="date" :disabled="onlyRead"
                      placeholder="请选择社保起交日期" style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="社保断交日期" prop="socialSecurityEndDate">
                    <el-date-picker v-model="dataForm.socialSecurityEndDate" type="date" :disabled="onlyRead"
                      placeholder="请选择社保断交日期" style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="职称" prop="prodessionId">
                    <el-input v-model="dataForm.prodessionId" placeholder="请输入职称" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="技能" prop="skillId">
                    <el-input v-model="dataForm.skillId" placeholder="请输入技能" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="排序" prop="sortCode">
                    <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode" controls-position="right"
                      style="width: 100%;" placeholder="请输入排序" maxlength="20" :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注" prop="description">
                    <el-input v-model="dataForm.description" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200"
                      :disabled="onlyRead" />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="个人资料" name="self">
            <el-form ref="dataForm2" :model="dataForm" :rules="rules2" label-width="160px" label-position="top">
              <el-row :gutter="30" class="custom-row">
                <el-col :sm="8" :xs="24">
                  <el-form-item label="头像" prop="headIcon">
                    <el-upload class="avatar-uploader" :headers="uploadHeaders" :disabled="onlyRead" placeholder="上传头像"
                      :action="define.comUploadUrl + '/userAvatar'" :show-file-list="false"
                      :on-success="handleAvatarSuccess" accept="image/*">
                      <img v-if="dataForm.headIcon" :src="define.comUrl + dataForm.headIcon" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="民族" prop="nation">
                    <el-select v-model="dataForm.nation" :disabled="onlyRead" placeholder="请选择民族" filterable
                      style="width: 100%;">
                      <el-option v-for="item in nationTreeData" :key="item.id" :label="item.fullName" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="籍贯" prop="nativePlace">
                    <el-input v-model="dataForm.nativePlace" :disabled="onlyRead" placeholder="请输入籍贯" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="证件类型" prop="certificatesType">
                    <el-select v-model="dataForm.certificatesType" :disabled="onlyRead" placeholder="请选择证件类型"
                      style="width: 100%;" maxlength="20">
                      <el-option v-for="item in certificatesTypeTreeData" :key="item.id" :label="item.fullName"
                        :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="证件号码" prop="certificatesNumber">
                    <el-input v-model="dataForm.certificatesNumber" :disabled="onlyRead" placeholder="请输入证件号码"
                      maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="文化程度" prop="education">
                    <el-select v-model="dataForm.education" :disabled="onlyRead" placeholder="请选择文化程度"
                      style="width: 100%;">
                      <el-option v-for="item in educationTreeData" :key="item.id" :label="item.fullName"
                        :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="出生年月" prop="birthday">
                    <el-date-picker v-model="dataForm.birthday" type="date" :disabled="onlyRead" placeholder="请选择出生年月"
                      style="width: 100%;" value-format="timestamp">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="证书" prop="certificateId">
                    <el-input v-model="dataForm.certificateId" :disabled="onlyRead" placeholder="请输入证书" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="办公电话" prop="telePhone">
                    <el-input v-model="dataForm.telePhone" :disabled="onlyRead" placeholder="请输入办公电话" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="办公座机" prop="landline">
                    <el-input v-model="dataForm.landline" :disabled="onlyRead" placeholder="请输入办公座机" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="手机号码" prop="mobilePhone">
                    <el-input v-model="dataForm.mobilePhone" :disabled="onlyRead" placeholder="请输入手机号码" maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="紧急联系人" prop="urgentContacts">
                    <el-input v-model="dataForm.urgentContacts" :disabled="onlyRead" placeholder="请输入紧急联系人"
                      maxlength="20" />
                  </el-form-item>
                </el-col>
                <el-col :sm="8" :xs="24">
                  <el-form-item label="紧急电话" prop="urgentTelePhone">
                    <el-input v-model="dataForm.urgentTelePhone" :disabled="onlyRead" placeholder="请输入紧急电话"
                      maxlength="20" />
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="24">
                  <el-form-item label="通讯地址" prop="postalAddress">
                    <el-input v-model="dataForm.postalAddress" type="textarea" :rows="3" :disabled="onlyRead"
                      placeholder="请输入通讯地址" maxlength="200" />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </el-form>
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
import { createUser, updateUser, getUserInfo } from '@/api/permission/user'
import moment from 'moment'

export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      dataForm: {
        id: '',
        sortCode: 0, //排序
        enabledMark: 1, //状态
        account: '', //账户
        awardGradeId: '', //考核等级
        bank: '', //开户银行
        bankinfo: '', //银行卡号
        certificateId: '', //证书
        contractStartDate: '', //合同开始日期
        contractEndDate: '', //合同结束日期
        employeeStatus: 'on_job', //员工状态
        employeeType: '', //员工类型
        honourId: '', //荣誉
        jobId: '', //职务
        jobNumber: '', //工号
        realName: '', //姓名
        maritalStatus: '', //婚姻状态
        mobilePhone: '',//手机号码
        nation: '', //民族
        nativePlace: '', //籍贯
        organizeId: '', //部门id
        organizeIdTree: [], //组织id树
        positionId: '', //岗位id
        postalAddress: '', //通信地址
        prodessionId: '', //职称
        resignationDate: '', //离职姓名
        roleId: '', //角色id
        skillId: '', //技能
        socialSecurityStartDate: '', //社保起交日期
        socialSecurityEndDate: '', //社保断交日期
        telePhone: '', //办公电话
        urgentContacts: '', //紧急联系人
        urgentTelePhone: '', //紧急联系人电话
        managerId: '', //主管id
        groupId: '', //分组ID
        description: '', //备注
        headIcon: '', //用户头像
        gender: null, //性别
        entryDate: null, //入职姓名
        certificatesType: '', //证件类型
        certificatesNumber: '', //证件号码
        education: '', //学历
        educationId: '', //学历
        birthday: null, //出生年月
        landline: '', //办公座机
        email: '', //电子邮箱
      },
      roleId: [],
      groupId: [],
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上个月',
          onClick(picker) {
            const end = new Date(moment((new Date().getTime())).format('YYYY-MM-01 00:00:00'))
            const start = new Date()
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            start.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      employeeTypeList: [{ label: "劳务派遣", value: "labor_dispatch" }, { label: "正式员工", value: "formal" }, { label: "兼职", value: "sideline" }, { label: "实习", value: "pratice" }, { label: "试用", value: "trial" }, { label: "学徒", value: "apprentice" }],
      employeeStatusList: [{ label: "在职", value: "on_job" }, { label: "离职", value: "off_job" }],
      rules: {
        account: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { validator: this.formValidate('fullName', '账户不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '账户最多为50个字符！', trigger: 'blur' }
        ],
        jobNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          { validator: this.formValidate('fullName', '工号不能含有特殊符号'), trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: this.formValidate('fullName', '真实姓名不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '真实姓名最多为50个字符！', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        organizeIdTree: [
          { required: true, message: '请选择所属组织', trigger: 'blur' }
        ],
        positionId: [
          { required: true, message: '请选择所属岗位', trigger: 'change' }
        ],
        employeeStatus: [
          { required: true, message: '请选择员工状态', trigger: 'blur' }
        ],
      },
      rules2: {}
    }
  },
  methods: {
    init(id, type, onlyRead) {
      this.visible = true
      this.dataForm.id = id || ''
      this.onlyRead = onlyRead
      this.roleId = []
      this.groupId = []
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
          // 获取证件类型
          this.$store.dispatch('base/getDictionaryData', { sort: 'certificateType' }).then(res => {
            this.certificatesTypeTreeData = res
          })
          // 获取性别
          this.$store.dispatch('base/getDictionaryData', { sort: 'sex' }).then(res => {
            this.genderTreeData = res
          })
        })
        if (this.dataForm.id) {
          getUserInfo(this.dataForm.id).then(res => {
            console.log(4444, res, this.define.comUrl);
            this.dataForm = res.data
            // this.dataForm.customerRecognitionTime = ''
            if (this.dataForm.roleId) this.roleId = this.dataForm.roleId.split(',')
            if (this.dataForm.groupId) this.groupId = this.dataForm.groupId.split(',')
            if (this.dataForm.positionId) this.positionId = this.dataForm.positionId.split(',')
            if (this.dataForm.organizeIdTree && this.dataForm.organizeIdTree.length) {
              this.getOptionsByOrgIds(this.dataForm.organizeIdTree)
            }
            if (res.data.employeeStatus === "off_job") {
              console.log(1111);
              // this.onlyRead = true
              this.rules.employeeStatus[0].required = false
              this.rules.positionId[0].required = false
              this.rules.organizeIdTree[0].required = false
              console.log(this.rules);
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
      this.dataForm[key] = this[key].join()
    },
    onOrganizeChange(val) {
      this.dataForm.positionId = ''
      this.dataForm.roleId = ''
      this.dataForm.organizeId = ''
      this.positionId = []
      this.roleId = []
      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate(['organizeIdTree']);
        this.$refs.dataForm.clearValidate(['positionId']);
      })
      if (!val || !val.length) return
      this.getOptionsByOrgIds(val)
    },
    getOptionsByOrgIds(organizeIdTree) {
      const organizeIds = organizeIdTree.map(o => o[o.length - 1])
      this.dataForm.organizeId = organizeIds.join()
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
        this.positionId = []
        this.$message.warning('请先选择所属组织')
      }
    },
    handleAvatarSuccess(res) {
      if (res.code === 200 && res.data && res.data.url) {
        this.dataForm.headIcon = res.data.url
      } else {
        this.$message.error('头像上传失败');
      }
    },
    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          const formMethod = this.dataForm.id ? updateUser : createUser
          formMethod(this.dataForm).then(res => {
            this.$message({
              message: res.msg,
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
          this.checkAndFocus()
        }
      })
    },
    // 校验与聚焦
    checkAndFocus() {
      // 一些校验的方法
      let isOk = true // 决定是否满足发送请求的条件

      // 校验dataForm
      let checkDataForm = () => {
        // 聚焦到dataForm第一个校验失败的dom
        let focusFirstChild = (el) => {
          if (el && el.nodeType === 1) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.focus() }
            else {
              const children = el.childNodes;
              for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.nodeType === 1) {
                  focusFirstChild(child);
                  break;
                }
              }
            }
          }
        }
        console.log(this.$refs);
        this.$refs['dataForm'].validate(valid => {
          if (!valid) {
            isOk = false
            // 表单验证失败，聚焦到第一个验证失败的表单项
            let refList = Object.keys(this.rules)
            for (let i = 0; i < refList.length; i++) {
              const formItem = this.$refs[refList[i]];
              if (formItem.validateState === 'error') {
                this.activeName = 'account'
                this.$nextTick(()=>{
                  focusFirstChild(formItem.$children[1].$el)
                })
                break
              }
            }
          }
        });
      }
      checkDataForm()
      return isOk
    },
  }
}
</script>
<style lang="scss" scoped>
>>>.avatar-uploader {
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

// .main {
//   padding: 10px 30px 0;
// }
::v-deep .el-tabs__header {
  padding: 0 !important;
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
  padding: 5px 10px;
}

::v-deep .el-select__tags {
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>