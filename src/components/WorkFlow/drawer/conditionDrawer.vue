<template>
  <el-drawer :append-to-body="true" title="条件设置" :visible.sync="conditionDrawer" direction="rtl"
    class="condition_copyer JNPF-common-drawer" size="550px" :before-close="closeDrawer">
    <select v-model="conditionConfig.priorityLevel" class="priority_level">
      <option v-for="item in conditionsConfig.conditionNodes.length" :value="item" :key="item">优先级{{ item }}</option>
    </select>
    <div class="demo-drawer__content">
      <div class="condition_content drawer_content">
        <p class="tip">当审批单同时满足以下条件时进入此流程</p>
        <!-- <el-form ref="dataForm" :model="conditionConfig" :rules="dataRule" label-position="top" label-width="120px">
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="节点编码" prop="code">
                  <el-input v-model="conditionConfig.code" placeholder="请输入节点编码" maxlength="20" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> -->
          <el-button icon="el-icon-plus" @click="addCondition">设置条件</el-button>
        <ul>
          <li v-for="(item, index) in conditionConfig.conditionList" :key="index">
            <span class="ellipsis">{{item.type==1?'发起人':item.showName}}：</span>
            <div v-if="item.type == 1">
              <p :class="conditionConfig.nodeUserList.length > 0 ? 'selected_list' : ''" @click.self="addConditionRole"
                style="cursor:text">
                <span v-for="(item1, index1) in conditionConfig.nodeUserList" :key="index1">
                  {{ item1.name }}<img src="@/assets/images/workflow/add-close1.png"
                    @click="$func.removeEle(conditionConfig.nodeUserList, item1, 'targetId')">
                </span>
                <input type="text" placeholder="请选择具体人员/角色/部门" v-if="conditionConfig.nodeUserList.length == 0"
                  @click="addConditionRole">
              </p>
            </div>
            <div v-else-if="item.columnType == 'string'">
              <p class="check_box">
                <!-- <a :class="$func.toggleStrClass(item, item1.key) && 'active'" @click="toStrChecked(item, item1.key)"
                  v-for="(item1, index1) in JSON.parse(item.fixedDownBoxValue)" :key="index1">{{ item1.value }}</a> -->
                  <el-select v-model="item.zdy1" :placeholder="'请选择' + item.showName">
                  <el-option v-for="( item, index ) in  item.options " :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </p>
            </div>
            <div v-else>
              <p style="margin-bottom:20px;">
                <select v-model="item.optType" :style="'width:' + (item.optType == 6 ? 370 : 100) + 'px'"
                  @change="changeOptType(item)">
                  <option value="1">小于</option>
                  <option value="2">大于</option>
                  <option value="3">小于等于</option>
                  <option value="4">等于</option>
                  <option value="5">大于等于</option>
                  <!-- <option value="6">介于两个数之间</option> -->
                </select>
                <el-input v-if="item.optType != 6"  maxlength="20" :placeholder="'请输入' + item.showName" 
                  v-model="item.zdy1" oninput="value = value.replace(/\D/g,'')" />
                  <!-- <el-input-number :min="0" :max="999999" v-model="dataForm.sortCode" controls-position="right"
                      style="width: 100%;" placeholder="请输入排序" maxlength="20" :disabled="onlyRead" /> -->
              </p>
              <p v-if="item.optType == 6">
                <input type="text" style="width:75px;" class="mr_10" v-enter-number="2" v-model="item.zdy1">
                <select style="width:60px;" v-model="item.opt1">
                  <option value="<">&lt;</option>
                  <option value="≤">≤</option>
                </select>
                <span class="ellipsis"
                  style="display:inline-block;width:60px;vertical-align: text-bottom;">{{ item.showName }}</span>
                <select style="width:60px;" class="ml_10" v-model="item.opt2">
                  <option value="<">&lt;</option>
                  <option value="≤">≤</option>
                </select>
                <input type="text" style="width:75px;" v-enter-number="2" v-model="item.zdy2">
              </p>
            </div>
            <!-- <a v-if="item.type == 1"
              @click="conditionConfig.nodeUserList = []; $func.removeEle(conditionConfig.conditionList, item, 'columnId')">删除</a> -->
            <a v-if="item" @click="$func.removeEle(conditionConfig.conditionList, item, 'columnId')">删除</a>
          </li>
        </ul>
    
        <el-dialog title="选择条件" :visible.sync="conditionVisible" width="480px" append-to-body class="condition_list">
          <p>请选择用来区分审批流程的条件字段</p>
          <p class="check_box">
            <!-- <a :class="$func.toggleClass(conditionList,{columnId:0},'columnId')&&'active'" @click="$func.toChecked(conditionList,{columnId:0},'columnId')">发起人</a> -->
            <a v-for="(item, index) in conditions" :key="index"
              :class="$func.toggleClass(conditionList, item, 'columnId') && 'active'"
              @click="$func.toChecked(conditionList, item, 'columnId')">{{ item.showName }}</a>
          </p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="conditionVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureCondition">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="demo-drawer__footer clear">
        <el-button type="primary" @click="saveCondition">确 定</el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import employeesRoleDialog from '../dialog/employeesRoleDialog.vue'
import { getApprovalDetail } from '@/api/basicData/approvalBusinessConditions'
import { checkApprovallineCode } from '@/api/basicData/approvalAdministrator'
// import { getConditions } from '@/plugins/api.js'
export default {
  components: {
    employeesRoleDialog
  },
  props: ['busType'],
  data() {
    return {
      conditionVisible: false,
      conditionsConfig: {
        conditionNodes: [],
      },
      conditionConfig: {},
      PriorityLevel: "",
      conditions: [],
      conditionList: [],
      checkedList: [],
      conditionRoleVisible: false,
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
            let hasDupes = this.conditionsConfig.codeList.some((item, index) => item === value && this.autoCode !== item);
            if (hasDupes) {
              callback(new Error("节点编码重复"));
            }else{
              callback();
            }
            }, trigger: 'blur',
          },
        ],
      }
    }
  },
  computed: {
    ...mapState('workflow', ['tableId', 'conditionsConfig1', 'conditionDrawer']),
  },
  watch: {
    conditionsConfig1(val) { 
      this.conditionsConfig = val.value;
      this.PriorityLevel = val.priorityLevel
      this.conditionConfig = val.priorityLevel
        ? this.conditionsConfig.conditionNodes[val.priorityLevel - 1]
        : { nodeUserList: [], conditionList: [] }
      this.conditionsConfig.codeList = this.conditionsConfig.codeList ? this.conditionsConfig.codeList : []
      this.autoCode = this.conditionConfig.code
    },
  },
  methods: {
    ...mapMutations('workflow', ['SET_CONDITION', 'SET_CONDITIONS_CONFIG']),
    changeOptType(item) {
      // if (item.optType == 1) {
      //   item.zdy1 = 2;
      // } else {
      //   item.zdy1 = 1;
      //   item.zdy2 = 2;
      // }
    },
    toStrChecked(item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : []
      var isIncludes = this.$func.toggleStrClass(item, key);
      if (!isIncludes) {
        a.push(key)
        item.zdy1 = a.toString()
      } else {
        this.removeStrEle(item, key);
      }
    },
    removeStrEle(item, key) {
      let a = item.zdy1 ? item.zdy1.split(",") : []
      var includesIndex;
      a.map((item, index) => {
        if (item == key) {
          includesIndex = index
        }
      });
      a.splice(includesIndex, 1);
      item.zdy1 = a.toString()
    },
    async addCondition() {
      this.conditionList = [];
      this.conditionVisible = true;
      let res = await getApprovalDetail(this.tableId) 
      let _data = res.data.map(item => {
        return {
          ...item,
          columnId: item.id,
          columnName: item.name,
          columnType: item.dataType === 'number' ? "Double" : "string",
          showName: item.name,
          tjCode:item.code
        }
      })
   
      this.conditions = _data;
      // if (this.conditionConfig.conditionList) {
      //   for (var i = 0; i < this.conditionConfig.conditionList.length; i++) {
      //     var { columnId } = this.conditionConfig.conditionList[i]
      //     if (columnId == 0) {
      //       this.conditionList.push({ columnId: 0 })
      //     } else {
      //       this.conditionList.push(this.conditions.filter(item => item.columnId == columnId)[0])
      //     }
      //   } 
      // }
    },
    sureCondition() {
      //1.弹窗有，外面无+
      //2.弹窗有，外面有不变
      this.conditionConfig.conditionList = []
      for (var i = 0; i < this.conditionList.length; i++) {
        var { columnId, showName, columnName, showType, columnType, fixedDownBoxValue ,optionNames,tjCode} = this.conditionList[i];
        // if (this.$func.toggleClass(this.conditionConfig.conditionList, this.conditionList[i], "columnId")) {
        //   continue;
        // }
        if (columnId == 0) {
          this.conditionConfig.nodeUserList == [];
          this.conditionConfig.conditionList.push({
            "type": 1,
            columnId,
            "showName": '发起人'
          });
        } else {
          if (columnType == "Double") {
            this.conditionConfig.conditionList.push({
              showType,
              columnId,
              "type": 2,
              showName,
              "optType": "1",
              "zdy1": "",
              "opt1": "<",
              "zdy2": "",
              "opt2": "<",
              "columnDbname": columnName,
              columnType,
              tjCode:tjCode
            })
          } else if (columnType == "string") {
           let labelArr =  this.conditionList[i].optionNames.split(',')
           let valueArr = this.conditionList[i].optionValues.split(',')
           let options = []
            if (labelArr.length == valueArr.length) {
              labelArr.forEach((item,index)=>{
                options.push({
                  label:item,
                  value:valueArr[index]
                })
              })
            } 
            this.conditionConfig.conditionList.push({
              showType,
              columnId,
              "type": 2,
              showName,
              "zdy1": "",
              "columnDbname": columnName,
              options,
              columnType,
              fixedDownBoxValue,
              tjCode:tjCode
            })
          }
        }
      } 
      //3.弹窗无，外面有-
      // for (let i = this.conditionConfig.conditionList.length - 1; i >= 0; i--) {
      //   if (!this.$func.toggleClass(this.conditionList, this.conditionConfig.conditionList[i], "columnId")) {
      //     this.conditionConfig.conditionList.splice(i, 1);
      //   }
      // }
      this.conditionConfig.conditionList.sort(function (a, b) { return a.columnId - b.columnId; });
      this.conditionList = [];
      this.conditionVisible = false;
    },
   async saveCondition() {
      let sureFlag = true
      // sureFlag = await this.$refs['dataForm'].validate().catch(err => false)
 
      let _data = this.conditionsConfig.conditionNodes[this.PriorityLevel - 1].conditionList
      if (_data.length) {
        _data.forEach((item,index)=>{
          if (!item.zdy1) {
            sureFlag = false
            this.$message.error(`第${index + 1}条${item.showName}输入值不能为空！`)
            return
          }
        })
      }
      // return
      if (sureFlag) { 
        // this.conditionsConfig.code = this.conditionsConfig.code ? this.conditionsConfig.code : this.generateUniqueNumber()
        this.conditionsConfig.codeList.push(this.conditionsConfig.code)
        var a = this.conditionsConfig.conditionNodes.splice(this.PriorityLevel - 1, 1)//截取旧下标
        this.conditionsConfig.conditionNodes.splice(this.conditionConfig.priorityLevel - 1, 0, a[0])//填充新下标
        this.conditionsConfig.conditionNodes.map((item, index) => {
          item.priorityLevel = index + 1
        }); 
        // return
        this.SET_CONDITION(false)
        for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
          this.conditionsConfig.conditionNodes[i].error = this.$func.conditionStr(this.conditionsConfig, i) == "请设置条件" && i != this.conditionsConfig.conditionNodes.length - 1
          this.conditionsConfig.conditionNodes[i].code = this.conditionsConfig.conditionNodes[i].code ? this.conditionsConfig.conditionNodes[i].code : this.generateUniqueNumber()
        }
        this.SET_CONDITIONS_CONFIG({
          value: this.conditionsConfig,
          flag: true,
          id: this.conditionsConfig1.id
        })
      }
    },
    addConditionRole() {
      this.conditionRoleVisible = true;
      this.checkedList = this.conditionConfig.nodeUserList
    },
    sureConditionRole(data) {
      this.conditionConfig.nodeUserList = data;
      this.conditionRoleVisible = false;
    },
    closeDrawer() {
      // this.setApprover(false)
      this.$store.commit('workflow/SET_CONDITION', false)
    },
    generateUniqueNumber() {
      var timestamp = new Date().getTime(); // 获取当前的时间戳
      var random = Math.floor(Math.random() * 1000); // 生成一个随机数，范围在0到999之间
      var uniqueNumber = timestamp.toString() + random.toString(); // 将时间戳和随机数进行组合
      return uniqueNumber;
    },
  }
}
</script>

<style lang="scss" scoped>
.condition_copyer {
  font-size: 16px !important;

  .demo-drawer__content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .drawer_content {
      height: 100%;
      border-bottom: 1px solid #f2f2f2;

      .check_box a {
        font-size: 12px;
        position: relative;
        padding-left: 20px;
        margin-right: 30px;
        cursor: pointer;
        color: #333;
      }
    }
  }

  .el-drawer__body {
    .priority_level {
      position: absolute;
      top: 11px;
      right: 52px;
      width: 100px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(217, 217, 217, 1);
    }
  }

  .condition_content {
    padding: 20px 20px 0;

    p.tip {
      margin: 20px 0;
      width: 510px;
      text-indent: 17px;
      line-height: 45px;
      background: rgba(241, 249, 255, 1);
      border: 1px solid rgba(64, 163, 247, 1);
      color: #46a6fe;
      font-size: 14px;
    }

    ul {
      max-height: 500px;
      overflow-y: scroll;
      margin-bottom: 20px;

      li {
        &>span {
          float: left;
          margin-right: 8px;
          // width: 55px;
          line-height: 32px;
          // text-align: right;
        }

        &>div {
          display: inline-block;
          width: 375px;

          &>p:not(:last-child) {
            margin-bottom: 10px;
          }
        }

        &:not(:last-child)>div>p {
          margin-bottom: 20px !important;
        }

        &>a {
          float: right;
          margin-right: 10px;
          margin-top: 7px;
        }

        select,
        input {
          width: 100%;
          height: 32px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(217, 217, 217, 1);
        }

        select+input {
          width: 260px;
        }

        select {
          margin-right: 10px;
          width: 90px;
        }

        p.selected_list {
          padding-left: 10px;
          border-radius: 4px;
          min-height: 32px;
          border: 1px solid rgba(217, 217, 217, 1);
          word-break: break-word;
        }

        p.check_box {
          line-height: 32px;
        }
      }
    }

    .el-button {
      margin-bottom: 20px;
    }
  }

  .demo-drawer__footer {
    margin: 20px 20px 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.condition_list {
  .el-dialog__body {
    padding: 16px 26px;
  }

  p {
    color: #666666;
    margin-bottom: 10px;

    &>.check_box {
      margin-bottom: 0;
      line-height: 36px;
    }

    
  }
}</style>

<style lang="scss" scoped>
.check_box a {
      font-size: 12px;
      position: relative;
      padding-left: 20px;
      margin-right: 28px;
      cursor: pointer;
      color: #333;
    }
    .check_box.not a:hover {
    color: #333;
}

.check_box.not a::before,
.check_box.not a:hover::before {
    border: none;
}

.check_box.not.active {
    background: #f3f3f3;
}

.radio_box a:hover::before,
.check_box a:hover::before {
    border: 1px solid #46a6fe;
}
    .check_box a::before {
      position: absolute;
      width: 14px;
      height: 14px;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      left: 0;
      top: 1px;
      content: "";
    }
    .check-dot.active::after,
.radio_box a.active::after,
.check_box a.active::after {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    content: "";
}

.radio_box a.active::after {
    background: #46a6fe;
}

.check_box a.active::after {
    background: url(~@/assets/images/check_box.png) no-repeat center;
}
.condition_copyer .condition_content ul li > a {
    float: right;
    margin-right: 10px;
    margin-top: 7px;
}
::v-deep  .el-input{
  width:66%!important;
}
</style>