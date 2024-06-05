<template>
  <el-drawer :append-to-body="true" title="审批人设置" :visible.sync="approverDrawer" direction="rtl"
    class="set_promoter JNPF-common-drawer" size="550px" :before-close="closeDrawer">
    <div class="demo-drawer__content">
      <div class="drawer_content">
        <div class="approver_content">
          <p class="tip tipTitle">审批设置</p>
          <!-- <el-form-item label="审批设置"> -->
          <el-radio-group :disabled="busType ? true : false" v-model="approverConfig.approvalType" class="clear"
            @change="changeType">
            <el-radio label="appoint">指定成员</el-radio>
            <el-radio label="manager">主管</el-radio>
            <el-radio label="option">发起人自选</el-radio>
            <!-- <el-radio :label="5">发起人自己</el-radio> -->
            <el-radio label="multilevel">连续多级主管</el-radio>
          </el-radio-group>
        <!-- </el-form-item> -->
          <!-- <el-form ref="dataForm" :model="approverConfig" :rules="dataRule" label-position="top" label-width="120px">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="节点编码" prop="code">
                  <el-input :disabled="busType ? true : false" v-model="approverConfig.code" placeholder="请输入节点编码"
                    maxlength="20" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> -->
          <p class="tip tipTitle2" v-if="approverConfig.approvalType == 'appoint' || (approverConfig.approvalType == 'option' && busType)">指定审批人处理审批单</p>
          <el-button  @click="addApprover" icon="el-icon-plus"
            v-if="approverConfig.approvalType == 'appoint'">设置成员</el-button>
          <el-button  @click="addApprover"
            v-if="approverConfig.approvalType == 'option' && busType">设置成员</el-button>
          <p class="selected_list" v-if="approverConfig.approvalType == 'appoint'">
            <span v-for="(item, index) in approverConfig.nodeUserList" :key="index">{{ item.name }}
              <img src="@/assets/images/workflow/add-close1.png"
                @click="$func.removeEle(approverConfig.nodeUserList, item, 'targetId')">
            </span>
            <a v-if="approverConfig.nodeUserList.length != 0" @click="approverConfig.nodeUserList = []">清除</a>
          </p>
          <p class="selected_list" v-if="approverConfig.approvalType == 'option' && busType">
            <template v-if="approverConfig.nodeUserList">
              <span v-for="(item, index) in approverConfig.nodeUserList" :key="index">{{ item.name }}
                <img v-show="item.name" src="@/assets/images/workflow/add-close1.png"
                  @click="$func.removeEle(approverConfig.nodeUserList, item, 'targetId')">
              </span>
              <a v-if="approverConfig.nodeUserList.length != 0" @click="approverConfig.nodeUserList = []">清除</a>
            </template>
          </p>


          <!-- <div class="approver_manager" v-show="approverConfig.approvalType == 'manager'">
            <p>
              <span>发起人的：</span>
              <el-select v-model="approverConfig.directorLevel" placeholder="请选择主管">
                <el-option v-for="item in directorMaxLevel" :value="item.value" :key="item.value" :label="item.label">
                </el-option>
              </el-select>
            </p>
            <p class="tip">找不到主管时，由上级主管代审批</p>
          </div> -->
          <!-- <div class="approver_self" v-show="approverConfig.approvalType==5">
                        <p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
                    </div> -->
          <!-- <div class="approver_self_select" v-show="approverConfig.approvalType == 'option'">
            <el-radio-group v-model="approverConfig.selectMode" style="width: 100%;">
              <el-radio :label="1">选一个人</el-radio>
              <el-radio :label="2">选多个人</el-radio>
            </el-radio-group>
            <h3>选择范围</h3>
            <el-radio-group v-model="approverConfig.selectRange" style="width: 100%;" @change="changeRange">
              <el-radio :label="2">指定成员</el-radio>
            </el-radio-group>
            <el-button type="primary" @click="addApprover" v-if="approverConfig.selectRange == 2">添加/修改成员</el-button>
            <el-button type="primary" @click="addRoleApprover" v-if="approverConfig.selectRange == 3">添加/修改角色</el-button>
            <p class="selected_list" v-if="approverConfig.selectRange == 2 || approverConfig.selectRange == 3">
              <span v-for="(item, index) in approverConfig.nodeUserList" :key="index">{{ item.name }}
                <img src="@/assets/images/workflow/add-close1.png"
                  @click="$func.removeEle(approverConfig.nodeUserList, item, 'targetId')">
              </span>
              <a v-if="approverConfig.nodeUserList != 'undefined' && approverConfig.selectRange != 1"
                @click="approverConfig.nodeUserList = []">清除</a>
            </p>
          </div> -->
          <div class="approver_manager" v-show="approverConfig.approvalType == 'multilevel'">
            <p class="tipTitle2">发起者的部门主管将作为审批人处理审批单</p>
            <p style="padding-bottom:20px">
              <span>发起人的：</span>
              <el-select v-model="approverConfig.examineEndDirectorLevel" placeholder="请选择上级主管">
                <el-option v-for="item in directorMaxLevel" :value="item.value" :label="item.label" :key="item.value">
                </el-option>
              </el-select>
            </p>
          </div>
          <!-- <div class="approver_some"
            v-if="(approverConfig.approvalType == 'appoint' && approverConfig.nodeUserList.length > 1) || approverConfig.approvalType == 'manager' || (approverConfig.approvalType == 'option' && approverConfig.selectMode == 2)">
            <p>多人审批时采用的审批方式</p>
            <el-radio-group v-model="approverConfig.examineMode" class="clear">
              <el-radio :label="1">依次审批</el-radio>
              <br />
              <el-radio :label="2" v-if="approverConfig.approvalType != 'manager'">会签(须所有审批人同意)</el-radio>
            </el-radio-group>
          </div> -->
          <div class="approver_some">
            <p class="tip tipTitle2">未找到成员，选择审批方式</p>
            <el-radio-group v-model="approverConfig.whenEmpty" class="clear">
              <el-radio :label="'pass'">自动审批通过</el-radio>
              <br />
              <el-radio :label="'admin'">转交给审核管理员</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="demo-drawer__footer clear ">
        <el-button type="primary" @click="saveApprover">确 定</el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
      <user-select v-show="false" ref="userRef" :multiple="approverConfig.selectMode == 2" @change="sureApprover"
        clearable style="width: 100%;">
        <!-- <ComSelect-list v-show="false" ref="userRef" placeholder="请选择审批管理员名称" auth @change="sureApprover"
        :title="'选择审批管理员名称'" :dataFormatting="dataFormatting" :method="getApprovalAdministratorList"
        :requestObj="approvalObj" :paramsObj="{}" /> -->
      </user-select>
      <!-- <employees-dialog 
                :visible.sync="approverVisible"
                :data.sync="checkedList"
                @change="sureApprover"
            /> -->
      <role-dialog :visible.sync="approverRoleVisible" :data.sync="checkedRoleList" @change="sureRoleApprover" />
    </div>
  </el-drawer>
</template>
<script>
import employeesDialog from '../dialog/employeesDialog.vue'
import roleDialog from '../dialog/roleDialog.vue'
import { mapState, mapMutations } from 'vuex'
import { getApprovalAdministratorList, checkApprovallineCode } from '@/api/basicData/approvalAdministrator'
export default {
  components: { employeesDialog, roleDialog },
  props: ['directorMaxLevel', 'busType'],
  data() {
    return {
      getApprovalAdministratorList,
      approverConfig: {},
      approverVisible: false,
      approverRoleVisible: false,
      approverEmplyessList: [],
      checkedRoleList: [],
      checkedList: [],
      approvalObj: {
        createByName: "",
        endTime: "",
        keyword: "",
        name: "",
        orderItems: [
          {
            "asc": true,
            "column": ""
          }
        ],
        pageNum: 1,
        pageSize: 20,
        startTime: ""
      },
      autoCode: '',
      dataForm: {
        code: '',
      },
      dataRule: {
        code: [
          { required: true, message: '请输入节点编码', trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              // this.approverConfig.codeList.push(value)
              let data = {
                codeList: [value]
              }
              let res = await checkApprovallineCode(data).catch(error => false)
              // 如果有重复的编码
              if (!res) return callback(new Error(' '))
              if (this.autoCode !== value && res.data.length) {
                callback(new Error("节点编码重复"));
              } else {
                callback();
              }
            }, trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              let hasDupes = this.approverConfig.codeList.some((item, index) => item === value && this.autoCode !== item);
              if (hasDupes) {
                callback(new Error("节点编码重复"));
              } else {
                callback();
              }
            }, trigger: 'blur',
          },
        ],
      }
    }
  },
  computed: {
    ...mapState('workflow', ['approverConfig1', 'approverDrawer']),
  },
  watch: {
    approverConfig1(val) { 
      this.approverConfig = val.value;
      this.approverConfig.nodeUserList = this.approverConfig.nodeUserList ? this.approverConfig.nodeUserList : []
      this.approverConfig.codeList = this.approverConfig.codeList ? this.approverConfig.codeList : []
      this.autoCode = this.approverConfig.code
    }
  },
  created() { 
  },
  methods: {
    ...mapMutations('workflow', ['SET_APPROVER_CONFIG', 'SET_APPROVER']),
    changeRange() {
      this.approverConfig.nodeUserList = [];
    },
    changeType(val) {
      this.approverConfig.nodeUserList = [];
      // this.approverConfig.examineMode = 1;
      // this.approverConfig.whenEmpty = 'admin'
      if (val == 'appoint') {
        // this.approverConfig.directorLevel = ''
        this.approverConfig.examineEndDirectorLevel = ''
        this.approverConfig.whenEmpty = ''
      } else if (val == 'option') {
        this.approverConfig.selectMode = 1;
        this.approverConfig.selectRange = 1;
        this.approverConfig.directorLevel = ''
        this.approverConfig.examineEndDirectorLevel = ''
      } else if (val == 'multilevel') {
        // this.approverConfig.examineEndDirectorLevel = '1'
        this.approverConfig.directorLevel = ''
      }
    },
    addApprover() {
      // this.approverVisible = true;
      this.$nextTick(() => { 
        this.$refs.userRef.openDialog()
      })
      return
      this.checkedList = this.approverConfig.nodeUserList
    },
    addRoleApprover() {
      this.approverRoleVisible = true;
      this.checkedRoleList = this.approverConfig.nodeUserList
    },
    sureApprover(id, data) { 
      let _data = []
      if (this.approverConfig.selectMode === 2) { 
        data.forEach(item => {
          _data.push({
            targetId: item.id,
            type: 1,
            name: item.fullName.split('/')[0]
          })
        })
      } else {
        _data.push({
          targetId: data.id,
          type: 1,
          name: data.fullName.split('/')[0]
        })
      }
      // return
      this.approverConfig.nodeUserList = _data;
      this.approverVisible = false;
    },
    sureRoleApprover(data) {
      this.approverConfig.nodeUserList = data;
      this.approverRoleVisible = false;
    },
    async saveApprover() {
      this.approverConfig.error = !this.$func.setApproverStr(this.approverConfig)
      // let submitFlag = await this.$refs['dataForm'].validate().catch(err => false)
      let submitFlag = true
      if (!this.approverConfig.whenEmpty){
        this.$message.error('请选择审批方式！')
          submitFlag = false
          return
      }
      if (this.approverConfig.approvalType === 'appoint') {
        if (this.approverConfig.nodeUserList.length == 0) {
          this.$message.error('请选择审批人！')
          submitFlag = false
          return
        }
      } else if (this.approverConfig.approvalType === 'manager') {
     
      } else if (this.approverConfig.approvalType === 'multilevel') {
        if (!this.approverConfig.examineEndDirectorLevel) {
          this.$message.error('请选择发起人的主管！')
          submitFlag = false
          return
        }
      } else if (this.approverConfig.approvalType === 'option' && this.busType) {
        if (this.approverConfig.nodeUserList.length == 0) {
          this.$message.error('请选择审批人！')
          submitFlag = false
          return
        }
      } else {
        this.approverConfig.nodeUserList = []
        this.approverConfig.designatedMembersName = ''
        this.approverConfig.designatedMembersId = ''
      }


      if (submitFlag) {
        this.approverConfig.code = this.approverConfig.code ? this.approverConfig.code : this.generateUniqueNumber() 
          this.approverConfig.codeList.push(this.approverConfig.code) 
        this.$store.commit('workflow/SET_APPROVER_CONFIG', {
          value: this.approverConfig,
          flag: true,
          id: this.approverConfig1.id
        })
        this.$emit("update:nodeConfig", this.approverConfig);
        this.$emit("update:codeList", this.approverConfig.codeList);
        this.closeDrawer()
      } else {
        // this.approverConfig.codeList =  this.approverConfig.codeList.filter(item => item !== this.approverConfig.code);
      }
    },
    generateUniqueNumber() {
      var timestamp = new Date().getTime(); // 获取当前的时间戳
      var random = Math.floor(Math.random() * 1000); // 生成一个随机数，范围在0到999之间
      var uniqueNumber = timestamp.toString() + random.toString(); // 将时间戳和随机数进行组合
      return uniqueNumber;
    },
    closeDrawer() {
      // this.setApprover(false)
      this.$store.commit('workflow/SET_APPROVER', false)
      this.dataForm.code = ''
    },
    dataFormatting(res) {
      let treeData = res.data.records.map(item => {
        item.name = item.personName;
        return item;
      });
      return treeData
    },
  }
}
</script>
<style lang="scss">
.set_promoter {
  font-size: 16px !important;

  .demo-drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .drawer_content {
      height: 100%;
    }
  }

  .approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
    height: 100%;
  }

  .approver_self_select .el-button,
  .approver_content .el-button {
    margin-bottom: 20px;
  }

  .approver_content .el-radio,
  .approver_some .el-radio,
  .approver_self_select .el-radio {
    // width: 27%;
    line-height: 30px;
    // margin-bottom: 20px;
  }

  .approver_manager p {
    line-height: 32px;
  }

  .approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }

  .approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 12px;
    line-height: 16px;
    color: #f8642d;
  }

  .approver_self {
    padding: 28px 20px;
  }

  .approver_self_select,
  .approver_content,
  {
    padding: 20px 20px 0;
  }

  .approver_manager p:first-of-type,
  .approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
  }

  .approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
  }

  .demo-drawer__footer {
    margin: 20px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}</style>
<style scoped>
  .tipTitle{
    margin-bottom:10px;
  }
  .tipTitle2{
    margin:10px 0px;
    font-size: 14px;
    color: #a5a5a5;
  }
</style>