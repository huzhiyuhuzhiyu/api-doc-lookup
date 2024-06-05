<template>
  <el-dialog :title="!dataForm.id ? '新建公式' : btntype ? '查看公式' : '编辑公式'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center"
    width="1000px" @close="handleClose">

    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
      label-width="120px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="公式编码" prop="formulaNumber">
            <el-input v-model.trim="dataForm.formulaNumber" placeholder="请输入公式编码" maxlength="100"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公式名称" prop="formulaName">
            <el-input v-model.trim="dataForm.formulaName" placeholder="请输入公式名称" maxlength="100"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态" prop="state">
            <el-select v-model="dataForm.state" style="width: 100%;" :disabled="btntype ? true : false">
              <el-option v-for="(item, index) in stateList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model.trim="dataForm.remark" placeholder="请输入备注" maxlength="200"
              :disabled="btntype ? true : false" />
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
          <el-form-item label="创建人" prop="createByName" v-if="btntype">
            <el-input v-model="dataForm.createByName" maxlength="200" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>

        <div v-if="!btntype">
          <el-button type="text" icon="el-icon-plus" @click="addtable()">添加</el-button>
        </div>
        <el-col :span="24">
          <el-table :data="bimFormulaLineList" style="width: 100%;" height="600">
            <el-table-column type="index" width="60" label="序号" />
            <el-table-column prop="formulaItemCode" label="公式项代码" width="120">
              <template slot="header">
                <span class="required">*</span>公式项代码
              </template>
              <template slot-scope="scope">

                <el-input v-model.trim="scope.row.formulaItemCode" :disabled="btntype ? true : false" maxlength="50">{{
                  scope.row.formulaItemCode
                }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="formulaItemName" label="公式项别名" width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.formulaItemName" :disabled="btntype ? true : false" maxlength="20">{{
                  scope.row.formulaItemName
                }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="formula" label="计算公式">
              <template slot="header">
                <span class="required">*</span>计算公式
              </template>
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.formula" :disabled="btntype ? true : false" maxlength="3000">{{
                  scope.row.formula
                }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="100">
              <template slot="header">
                <span class="required">*</span>排序
              </template>
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.sort" maxlength="4" :disabled="btntype ? true : false"
                  @input="handleInput(scope.row)" >{{
                    scope.row.sort }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" v-if="!btntype">
              <template slot-scope="scope">
                <!-- <el-button @click="addtable(scope.row)" type="text" >添加</el-button> -->
                <el-button @click="deltable(scope)" v-if="!btntype" type="text"
                  style="color:rgb(245,108,108)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer" v-show="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>

import { addFormulaList, editFormulaList, getFormulaData, checkFormulaNum, batchCheckformula } from "@/api/basicData/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      stateList: [{
        label: "启用",
        value: "enable"
      }, {
        label: "禁用",
        value: "disabled"
      },
      ],
      dataForm: {
        createTime: "",
        createBy: "",
        formulaName: "",
        formulaNumber: "",
        remark: "",
        state: "enable",
        id: ""

      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      autoCode: [],
      bimFormulaLineList: [],
      btntype: false,
      dataRules: {
        formulaName: [
          { required: true, message: '请输入公式名称', trigger: 'blur' },
        ],
        formulaNumber: [
          { required: true, message: '请输入公式编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              checkFormulaNum(this.jnpf.specialCodeUrl(value), this.dataForm.id).then(res => {
                if (res.data) {
                  callback(new Error("公式编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ]
      }
    }
  },
  created() {
  },
  methods: {
    handleInput(row) {
      // 使用正则表达式判断输入的内容是否为正整数
      const reg = /^[1-9]\d*$/;
      if (!reg.test(row.sort)) {
        this.$message({
          message: "排序只能输入正整数",
          type: "error",
        })
        setTimeout(() => {
          row.sort = ''; // 如果不是正整数，则清空输入框的内容
        }, 200);
      }
    },
    // checkDuplicate(row, column) {
    //   console.log(row, column);
    //   const value = row[column];

    //   const duplicates = this.bimFormulaLineList.filter(item => item[column] === value);
    //   console.log(this.bimFormulaLineList, duplicates);
    //   if (duplicates.length > 1) {
    //     // 输入的值与当前列中的其他值重复
    //     row[column] = ''; // 清空输入框的值
    //     // 或者给出提示
    //     this.$message.error('不能输入相同的值');
    //   }
    // },
    handleClose() {
    },
    // 删除当前公式行
    deltable(row, index) {
      this.bimFormulaLineList.splice(row.$index, 1)
    },
    // 新增公式行
    addtable() {
      this.bimFormulaLineList.push({
        formulaItemCode: "",
        formulaItemName: "",
        formula: "",
        sort: "",
      },)

    },
    init(id, type) {
      this.autoCode = []
      this.visible = true
      this.dataForm.id = id || ''
      if (type == "edit" || type == 'add') {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getFormulaData(this.dataForm.id).then(res => {
            this.bimFormulaLineList = res.data.bimFormulaLineList
            this.dataForm = res.data.bimFormula
            this.formLoading = false
            this.bimFormulaLineList.forEach((item, ind) => {
              this.autoCode.push(item.formulaItemCode)
            })
          })
        } else {
          this.formLoading = false
          this.bimFormulaLineList = []
        }
      })
    },
    // 校验编码
    checkCode() {
      if (this.bimFormulaLineList.length == 0) {
        this.request()
        return
      }


      let flag = true
      // 校验表中编码不能重复
      let tempArr = []
      let errorArr = []
      this.bimFormulaLineList.forEach(item => {
        if (tempArr.includes(item.formulaItemCode)) {
          if (!errorArr.includes(item.formulaItemCode)) {
            errorArr.push(item.formulaItemCode)
          }
          flag = false
        } else {
          tempArr.push(item.formulaItemCode)
        }
      })
      if (errorArr.length) {
        this.$message.error('重复的编码：' + errorArr.join('、'))
        this.btnLoading = false
      }


      // 校验库中有没有重复编码(数组方式)
      if (flag) {
        // 去除对话框打开自动填写的属性编码
        let filteredArray = tempArr.filter(item => !this.autoCode.includes(item));
        if (filteredArray.length > 0) {
          batchCheckformula(filteredArray).then(res => {
            if (res.data.length) {
              this.$message.error('数据库中已存在公式项代码：' + res.data.join('、'))
              this.btnLoading = false
            } else {
              this.request()
            }
          })
        } else {
          this.request()
        }
      }
    },
    // 发送请求
    request() {
      let queryData = {
        bimFormula: this.dataForm,
        bimFormulaLineList: this.bimFormulaLineList
      }
      this.btnLoading = true
      let requestMethod = this.dataForm.id ? editFormulaList : addFormulaList
      let successTip = this.dataForm.id ? "修改" : "新增"

      requestMethod(queryData).then(res => {
        this.$message({
          message: successTip + '成功',
          type: 'success',
          duration: 1000,
          onClose: () => {
            this.visible = false
            this.btnLoading = false
            this.$emit('close', true)
          }
        })
      }).catch(() => {
        this.btnLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let flag = null;
          if (this.bimFormulaLineList.length > 0) {
            for (let index = 0; index < this.bimFormulaLineList.length; index++) {
              const item = this.bimFormulaLineList[index];
              // 判断必填项是否完善
              if (!item.formulaItemCode) {
                this.btnLoading = false
                flag = false;
                this.$message({
                  message: "请填写第" + (index + 1) + "行公式项代码",
                  type: 'error',
                  duration: 1000,
                })
                break
              } else if (!item.formula) {
                this.btnLoading = false
                flag = false;
                this.$message({
                  message: "请填写第" + (index + 1) + "行计算公式",
                  type: 'error',
                  duration: 1000,
                })
                break

              } else if (!item.sort) {
                this.btnLoading = false
                flag = false;
                this.$message({
                  message: "请填写第" + (index + 1) + "行排序",
                  type: 'error',
                  duration: 1000,
                })
                break
              }
              // 判断值是否符合要求
              if (!Number(item.sort) && item.sort != '0') {
                this.btnLoading = false
                flag = false;
                this.$message({
                  message: "第" + (index + 1) + "行排序不能为字符串",
                  type: 'error',
                  duration: 1000,
                })
                break
              }
            }
          } else {
            flag = false;
            this.$message.error("请至少添加一条公式")
          }
          const groupedArr = this.bimFormulaLineList.reduce((result, item) => {
            const key = item.sort;
            if (!result[key]) {
              result[key] = [];
            }
            result[key].push(item);
            return result;
          }, {});
          const newArray = Object.values(groupedArr);
          newArray.forEach(item => {
            if(item.length>1){
            flag = false;
            this.$message.error("不能存在相同的排序数据")
            }
          });
        
          if (flag === false) return
          this.checkCode()
          // this.btnLoading = true;
          // let formMethod = this.dataForm.id ? editFormulaList : addFormulaList;

          // formMethod(this.dataForm).then(res => {
          //   console.log(666, res);
          //   let msg = ""
          //   if (formMethod == editBasicData) {
          //     msg = '修改成功'
          //   } else {
          //     msg = '新建成功'
          //   }
          //   this.$message({
          //     message: msg,
          //     type: 'success',
          //     duration: 1500,
          //     onClose: () => {
          //       this.visible = false
          //       this.btnLoading = false
          //       this.$emit('close', true)
          //     }
          //   })
          // }).catch(() => {
          //   this.btnLoading = false
          // })
        }
      })
    }
  }
}
</script>
<style scoped>
.required {
  color: red;
  margin-right: 4px;
}
</style>