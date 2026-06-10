<!--
 * @Date: 2022-08-04 16:29:35
 * @LastEditors: StavinLi
 * @LastEditTime: 2022-09-21 14:14:32
 * @FilePath: /Workflow/src/components/drawer/copyerDrawer.vue
-->
<template>
  <el-drawer :append-to-body="true" title="抄送人设置" :visible.sync="copyerDrawer" direction="rtl"
    class="set_copyer JNPF-common-drawer" size="550px" :before-close="closeDrawer">
    <div class="demo-drawer__content">
      <div class="copyer_content drawer_content">
        <!-- <el-form ref="dataForm" :model="copyerConfig" :rules="dataRule" label-position="top" label-width="120px">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="节点编码" prop="code">
                <el-input v-model="copyerConfig.code" placeholder="请输入节点编码" maxlength="20" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form> -->
        <p class="tip tipTitle">抄送设置</p>
        <el-button icon="el-icon-plus" @click="addCopyer">添加成员</el-button>
        <p class="selected_list">
          <span style="margin:10px 10px 10px 0px;" v-for="(item, index) in copyerConfig.nodeUserList" :key="index">{{ item.name }}
            <template v-if="busType">
              <img src="@/assets/images/workflow/add-close1.png" v-if="item.defaultFlag == 0"
                @click="$func.removeEle(copyerConfig.nodeUserList, item, 'targetId')">
            </template>
            <template v-else>
              <img src="@/assets/images/workflow/add-close1.png"
                @click="$func.removeEle(copyerConfig.nodeUserList, item, 'targetId')">
            </template>
          </span>
          <template v-if="busType">
            <a v-if="copyerConfig.nodeUserList && copyerConfig.nodeUserList.length != 0"
              @click="copyerConfig.nodeUserList = copyerConfig.nodeUserList.filter(item => item.defaultFlag !== 0)">清除</a>
          </template>
          <template v-else>
            <a v-if="copyerConfig.nodeUserList && copyerConfig.nodeUserList.length != 0"
              @click="copyerConfig.nodeUserList = []">清除</a>
          </template>
        </p>
        <!-- <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
                    <el-checkbox :label="1">允许发起人自选抄送人</el-checkbox>
                </el-checkbox-group> -->
      </div>
      <div class="demo-drawer__footer clear">
        <el-button type="primary" @click="saveCopyer">确 定</el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
      <user-select v-show="false" ref="userRef" multiple @change="sureCopyer" clearable
        style="width: 100%;"></user-select>
      <!-- <employees-role-dialog 
                :visible.sync="copyerVisible"
                :data.sync="checkedList"
                @change="sureCopyer"
            /> -->
    </div>
  </el-drawer>
</template>
<script>
import employeesRoleDialog from '../dialog/employeesRoleDialog.vue'
import { mapState, mapMutations } from 'vuex'
import { checkApprovallineCode } from '@/api/basicData/approvalAdministrator'
export default {
  components: {
    employeesRoleDialog
  },
  props: ['directorMaxLevel', 'busType'],
  data() {
    return {
      copyerConfig: {},
      ccSelfSelectFlag: [],
      copyerVisible: false,
      checkedList: [],
      autoCode: '',
      dataRule: {
        code: [
          { required: true, message: '请输入节点编码', trigger: 'blur' },
          {
            validator: async (rule, value, callback) => {
              // console.log(value, this.dataForm.id);
              // this.approverConfig.codeList.push(value)
              let data = {
                codeList: [value],
              }
              let res = await checkApprovallineCode(data).catch(error => false)
              // 如果有重复的编码
              if (this.autoCode !== value && res.data.length) {
                callback(new Error("节点编码重复"));
              } else {
                callback();
              }
            }, trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              let hasDupes = this.copyerConfig.codeList.some((item, index) => item === value && this.autoCode !== item);
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
    ...mapState('workflow', ['copyerDrawer', 'copyerConfig1']),
  },
  watch: {
    copyerConfig1(val) { 
      this.copyerConfig = val.value;
      this.copyerConfig.codeList = this.copyerConfig.codeList ? this.copyerConfig.codeList : []
      this.ccSelfSelectFlag = this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag]
      this.autoCode = this.copyerConfig.code
    }
  },
  methods: {
    ...mapMutations('workflow', ['SET_COPYER_CONFIG', 'SET_COPYER']),
    addCopyer() {
      this.$nextTick(() => { 
        this.$refs.userRef.openDialog()
      })
      return
      this.copyerVisible = true;
      this.checkedList = this.copyerConfig.nodeUserList
    },
    sureCopyer(id, data) { 
      if (data.length) {
        let _data = []
        data.forEach((item, index) => {
          _data.push({
            targetId: item.id,
            type: 1,
            name: item.fullName.split('/')[0],
            code: this.copyerConfig.code,
            defaultFlag: this.busType ? 0 : 1,
          })
        })
        if (this.copyerConfig.nodeUserList.length) {
          const deletedArray = [];
          _data = _data.filter(item1 => {
            const index = this.copyerConfig.nodeUserList.findIndex(item2 => item2.targetId === item1.targetId);
            if (index !== -1) {
              deletedArray.push(item1.name);
              if (deletedArray.length) {
                // this.$message.error(`已经添加过的抄送人：${deletedArray.join('、')}`)
              }
              return false;
            }
            return true;
          });
        }
        this.copyerConfig.nodeUserList = [...this.copyerConfig.nodeUserList, ..._data]
        this.copyerVisible = false;
      }
    },
    async saveCopyer() {
      this.copyerConfig.ccSelfSelectFlag = this.ccSelfSelectFlag.length == 0 ? 0 : 1;
      this.copyerConfig.error = !this.$func.copyerStr(this.copyerConfig);
      // let submitFlag = await this.$refs['dataForm'].validate().catch(err => false)
      let submitFlag = true
      this.copyerConfig.code = this.copyerConfig.code ? this.copyerConfig.code : this.generateUniqueNumber()
      if (!this.copyerConfig.nodeUserList.length) {
        this.$message.error('请选择抄送人！')
        submitFlag = false
      } else {
        this.copyerConfig.nodeUserList.forEach(item => {
          item.code = this.copyerConfig.code
        })
      }
      if (submitFlag) {
        this.copyerConfig.codeList.push(this.copyerConfig.code)
        this.$store.commit('workflow/SET_COPYER_CONFIG', {
          value: this.copyerConfig,
          flag: true,
          id: this.copyerConfig1.id
        })
        this.$emit("update:nodeConfig", this.copyerConfig);
        this.$emit("update:codeList", this.copyerConfig.codeList);
        this.closeDrawer();
      }
    },
    generateUniqueNumber() {
      var timestamp = new Date().getTime(); // 获取当前的时间戳
      var random = Math.floor(Math.random() * 1000); // 生成一个随机数，范围在0到999之间
      var uniqueNumber = timestamp.toString() + random.toString(); // 将时间戳和随机数进行组合
      return uniqueNumber;
    },
    closeDrawer() {
      this.$store.commit('workflow/SET_COPYER', false)
      // this.setCopyer(false)
    },
  }
}
</script>

<style lang="scss">
.set_copyer {
  font-size: 16px !important;

  .demo-drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .drawer_content {
      height: 100%;
    }
  }

  .copyer_content {
    padding: 20px 20px 0;

    .tipTitle {
      margin-bottom: 10px;
    }

    .tipTitle2 {
      margin: 10px 0px;
      font-size: 16px;
      color: #a5a5a5;
    }

    .el-button {
      margin-bottom: 20px;
    }

    .el-checkbox {
      margin-bottom: 20px;
    }
  }

  .demo-drawer__footer {
    margin: 20px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>