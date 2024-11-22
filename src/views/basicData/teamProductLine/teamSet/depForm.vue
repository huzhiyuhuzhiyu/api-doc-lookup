<template>
  <el-dialog :title="!dataForm.id ? '新建班组' : !btntype ? '编辑班组' : '查看班组'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
    width="70%">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-row :gutter="30" v-if="tableDataFlag">
        <el-col :span="12">
          <el-form-item label="班组编码" prop="code">
            <el-input v-model="dataForm.code" placeholder="请输入班组编码" maxlength="20"
              :disabled="btntype ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag ? true : false" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="班组名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入班组名称" maxlength="20" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属项目" prop="projectId">
            <el-select v-model="dataForm.projectId" placeholder="请选择所属项目"
              :disabled="btntype || userInfo.projectId !== '1'" style="width:100%">
              <el-option v-for="item in projectIdData" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-select v-model="dataForm.state" placeholder="请选择状态" style="width: 100%;"
              :disabled="btntype ? true : false">
              <el-option v-for="(item, index) in statusList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="做工类型" prop="workType">
            <el-select v-model="dataForm.workType" placeholder="请选择做工类型" style="width: 100%;" @change="hangleC"
              :disabled="btntype ? true : false">
              <el-option v-for="(item, index) in workTypeList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报工类型" prop="reportingType">
            <el-select v-model="dataForm.reportingType" placeholder="请选择报工类型" style="width: 100%;"
              :disabled="btntype ? true : false">
              <el-option v-for="(item, index) in reportingTypeList" :key="index" :label="item.label" :value="item.value"
                :disabled="item.value == 'by_total' && dataForm.workType != 'same'"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" maxlength="200" :disabled="btntype ? true : false"
              placeholder="请输入备注" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间" prop="createTime" v-if="btntype">
            <el-date-picker v-model="dataForm.createTime" type="date" format="yyyy-MM-dd" style="width: 100%;"
              value-format="yyyy-MM-dd" :picker-options="pickerOptions" placeholder="请选择日期"
              :disabled="btntype ? true : false">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建人" prop="createBy" v-if="btntype">
            <el-input v-model="dataForm.createBy" maxlength="200" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-table :data="lines" height="300" highlight-current-row>
            <el-table-column prop="personnelIdText" label="人员名称" width="120">
              <template slot="header">
                <span class="required">*</span>人员名称
              </template>
              <template slot-scope="scope">
                <user-select v-model="scope.row.personnelId" placeholder="请选择人员" clearable
                  :disabled="btntype ? true : false">
                </user-select>

              </template>
            </el-table-column>
            <el-table-column prop="weight" label="权重(%)" width="100" v-if="dataForm.workType == 'same'">
              <template slot="header">
                <span class="required">*</span>权重(%)
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight" type="number" :disabled="btntype ? true : false"
                  oninput="value = value.replace(/[^0-9]/g,'')">{{
                    scope.row.weight
                  }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="joinTime" label="加入时间" width="260">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.joinTime" type="datetime" format="yyyy-MM-dd hh:mm:ss"
                  value-format="yyyy-MM-dd hh:mm:ss" :picker-options="pickerOptions" placeholder="请选择时间"
                  :disabled="btntype ? true : false">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="leaveTime" width="260" label="离开时间">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.leaveTime" type="datetime" format="yyyy-MM-dd hh:mm:ss"
                  value-format="yyyy-MM-dd hh:mm:ss" :picker-options="pickerOptions" placeholder="请选择时间"
                  :disabled="btntype ? true : false">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" width="100">
              <template slot-scope="scope">
                <el-select v-model="scope.row.state" style="width: 100%;" :disabled="btntype ? true : false">
                  <el-option v-for="(item, index) in ponsestatusList" :key="index" :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" :disabled="btntype ? true : false" placeholder="请输入备注">{{
                  scope.row.remark
                }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" v-if="!btntype">
              <template slot-scope="scope">
                <!-- <el-button @click="addtable(scope.row)" type="text" >添加</el-button> -->
                <el-button @click="deltable(scope)" type="text" style="color:rgb(245,108,108)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-actions" @click="addtable()" v-if="!btntype">
            <el-button type="text" icon="el-icon-plus">添加</el-button>
          </div>
        </el-col>
      </el-row>


    </el-form>
    <span slot="footer" class="dialog-footer" v-if="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addGroupData, deleteGroupData, editGroupData, getGroupDataInfo, checkGroupCode } from "@/api/basicData/index";
import getProjectList from '@/mixins/generator/getProjectList'
export default {
  mixins: [getProjectList],
  data() {
    return {
      tableDataFlag: false,
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      reportingTypeList: [{
        label: "按工序和人报工",
        value: "by_process"
      },
      {
        label: "按工序总数报工",
        value: "by_total"
      }],
      workTypeList: [{
        label: "同道工序",
        value: "same"
      },
      {
        label: "不同工序",
        value: "different"
      }],
      ponsestatusList: [{
        label: "正常",
        value: 'normal',
      }, {
        label: "离开",
        value: 'leave',
      }],
      statusList: [{
        label: "启用",
        value: 'enable',
      }, {
        label: "停用",
        value: 'disabled',
      }],
      dataForm: {
        remark: '',
        projectId: '',
        code: "",
        name: "",
        state: 'enable',
        createTime: "",
        createBy: "",
        id: "",
        workType: "",
        reportingType: "",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      lines: [
      ],
      checkCodeFlag: null,
      btntype: false,
      dataRule: {
        projectId: [
          { required: true, message: '选择所属项目', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入班组名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入班组编码', trigger: 'blur' },
          { validator: this.formValidate('fullName', '编码不能含有特殊符号'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkGroupCode(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  this.checkCodeFlag = false
                  callback(new Error("班组编码重复"));
                } else {
                  this.checkCodeFlag = true
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        workType: [{ required: true, message: "请选择做工类型", trigger: "change" }],
        reportingType: [{ required: true, message: "请选择报工类型", trigger: "change" }]

      },
      codeConfig: {},
    }
  },
  created() {
  },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code);
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) {
      }
    },
    hangleC(e) {
      console.log(e);
      if (this.dataForm.workType == "different") {
        this.dataForm.reportingType = ""
      }
      this.lines = []
    }
    ,
    deltable(row, index) {
      this.lines.splice(row.$index, 1)
    },
    addtable() {
      console.log(5555);
      if (this.dataForm.workType == "same") {
        this.lines.push(
          {
            personnelId: "",
            weight: "",
            joinTime: "",
            leaveTime: "",
            state: "normal",
            remark: ""
          })
      } else {
        this.lines.push(
          {
            personnelId: "",
            joinTime: "",
            leaveTime: "",
            state: "normal",
            remark: ""
          })
      }


    },
    async init(id, type) {
      this.visible = true
      await this.getProjectList()
      if (this.userInfo.projectId === '1') {
        this.projectIdData = this.projectIdData.filter(item => item.id !== '1')
      } else {
        this.$set(this.dataForm, 'projectId', this.userInfo.projectId)
        this.tableDataFlag = true
      }
      console.log(this.dataForm.projectId, 'pjkjjj');
      this.lines = []
      this.dataForm.id = id || ''
      if (type == "edit") {
        this.btntype = false
        this.fetchData('bm_sc_bz', false)
      } else if (type == "add") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getGroupDataInfo(this.dataForm.id).then(res => {
            console.log("班组", res);
            this.dataForm = res.data.group
            this.lines = res.data.returnLines
            // this.formLoading = false

          })
        } else {
          this.fetchData('bm_sc_bz', true)
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      console.log(this.dataForm.code, this.dataForm.name, this.dataForm.workType, this.dataForm.reportingType, this.checkCodeFlag);
      if (this.dataForm.code && this.dataForm.name && this.dataForm.workType && this.dataForm.reportingType && this.checkCodeFlag) {
        this.btnLoading = true;
        let formMethod = this.dataForm.id ? editGroupData : addGroupData;
        let obj = {
          group: this.dataForm,
          lines: this.lines
        }
        let flag = null;
        let num = 0;
        if (this.lines.length > 0) {
          for (let index = 0; index < this.lines.length; index++) {
            const item = this.lines[index];
            if (!item.personnelId) {
              flag = false
              this.btnLoading = false;
              return this.$message({
                message: "第" + (index + 1) + "行人员不能为空",
                type: 'error',
                duration: 1500,
              })
            }
            if (this.dataForm.workType == "same") {
              if (!item.weight) {
                flag = false
                this.btnLoading = false;
                return this.$message({
                  message: "第" + (index + 1) + "行权重不能为空",
                  type: 'error',
                  duration: 1500,
                })
              } else {
                num += Number(item.weight)
              }
              if (index == this.lines.length - 1) {
                if (num > 100) {
                  flag = false
                  this.btnLoading = false;
                  return this.$message({
                    message: "权重累计不能超过100",
                    type: 'error',
                    duration: 1500,
                  })
                } else if (num < 100) {
                  console.log(6666);
                  flag = false
                  this.btnLoading = false;
                  return this.$message({
                    message: "权重累计不足100",
                    type: 'error',
                    duration: 1500,
                  })
                }
              }

            }


          }
        } else {
          flag = false
          this.btnLoading = false;
          return this.$message({
            message: "请添加人员",
            type: 'error',
            duration: 1500,
          })
        }
        console.log("this.lines", this.lines);
        if (flag === false) return
        formMethod(obj).then(res => {
          console.log(666, res);
          let msg = ""
          if (formMethod == editGroupData) {
            msg = '修改成功'
          } else {
            msg = '新建成功'
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
        this.$refs['dataForm'].validate((valid) => {
          console.log(valid);
          if (valid) {
            this.btnLoading = true;
            let formMethod = this.dataForm.id ? editGroupData : addGroupData;
            let obj = {
              group: this.dataForm,
              lines: this.lines
            }
            let flag = null;
            let num = 0;
            if (this.lines.length > 0) {
              for (let index = 0; index < this.lines.length; index++) {
                const item = this.lines[index];
                if (!item.personnelId) {
                  flag = false
                  this.btnLoading = false;
                  return this.$message({
                    message: "第" + (index + 1) + "行人员不能为空",
                    type: 'error',
                    duration: 1500,
                  })
                }
                if (this.dataForm.workType == "same") {
                  if (!item.weight) {
                    flag = false
                    this.btnLoading = false;
                    return this.$message({
                      message: "第" + (index + 1) + "行权重不能为空",
                      type: 'error',
                      duration: 1500,
                    })
                  } else {
                    num += Number(item.weight)
                  }
                  console.log("num", num);
                  if (index == this.lines.length - 1) {
                    if (num > 100) {
                      flag = false
                      this.btnLoading = false;
                      return this.$message({
                        message: "权重累计不能超过100",
                        type: 'error',
                        duration: 1500,
                      })
                    } else if (num < 100) {
                      console.log(6666);
                      flag = false
                      this.btnLoading = false;
                      return this.$message({
                        message: "权重累计不足100",
                        type: 'error',
                        duration: 1500,
                      })
                    }
                  }

                }


              }
            } else {
              flag = false
              this.btnLoading = false;
              return this.$message({
                message: "请添加人员",
                type: 'error',
                duration: 1500,
              })
            }
            console.log("this.lines", this.lines);
            if (flag === false) return
            formMethod(obj).then(res => {
              console.log(666, res);
              let msg = ""
              if (formMethod == editGroupData) {
                msg = '修改成功'
              } else {
                msg = '新建成功'
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
          }
        })
      }
      // code: "",
      //   name: "",
      //   state: 'enable',
      //   createTime: "",
      //   createBy: "",
      //   id: "",
      //   workType: "",
      //   reportingType: "",

    }
  }
}
</script>
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.required {
  color: red;
  margin-right: 4px;
}
</style>
<style>
.el-input--prefix .el-input__inner {
  padding: 0 15;
}
</style>
