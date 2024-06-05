<template>
  <el-dialog :title="!dataForm.id ? '新建图号规则' : btntype ? '查看图号规则' : '编辑图号规则'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="80%"
    @close="handleClose">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRules" label-position="top"
      label-width="120px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="产品类型" prop="productType">
            <el-select v-model="dataForm.productType" placeholder="请选择产品类型" style="width: 100%;"
              :disabled="btntype ? true : false">
              <el-option v-for="(item, index) in productTypeList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="dataForm.customerName" placeholder="请输入客户名称" maxlength="1000"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户物料号" prop="customerProductNo">
            <el-input v-model="dataForm.customerProductNo" placeholder="请输入客户物料号" maxlength="1000"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户图号（代码：khth）" prop="customerDrawingNumber">
            <el-input v-model="dataForm.customerDrawingNumber" placeholder="请输入客户图号" maxlength="1000"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品图号" prop="materialCode">
            <el-input v-model="dataForm.materialCode" placeholder="请输入产品图号" maxlength="1000"
              :disabled="btntype ? true : false" :readonly="dataForm.formulaId !== ''" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否降级拆分" prop="splitFlag">
            <el-select v-model="dataForm.splitFlag" placeholder="请选择是否降级拆分" :disabled="btntype || !dataForm.materialCode.includes('+WS')">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="公式" prop="formulaId">
            <el-select v-model="dataForm.formulaName" style="width: 100%;margin-right: 10px;"
              :disabled="!dataForm.customerDrawingNumber || btntype ? true : false" @change="selectFormula">
              <el-option v-for="(item, index) in formulaList" :key="index" :label="item.formulaName"
                :value="item.id"></el-option>
            </el-select>
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
        <el-col :span="24">
          <el-button type="primary" style="float: right;margin-bottom: 10px;" v-if="!btntype"
            :disabled="dataForm.formulaId == '' ? true : false" size="mini" @click="handleCoun()">计算</el-button>
          <el-table :data="lines" style="width: 100%;" height="580">
            <el-table-column prop="formulaItemName" label="代码（别名）" width="130">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.formulaItemCode + '(' + scope.row.formulaItemName + ')' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="formula" label="计算公式">
              <template slot-scope="scope">
                <el-input v-model="scope.row.formula" type="textarea" :rows="3" :disabled="btntype ? true : false"
                  maxlength="3000">{{
                    scope.row.formula
                  }}
                </el-input>
              </template>
            </el-table-column>

            <el-table-column prop="val" label="值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.val" type="textarea" :rows="3" readonly :disabled="btntype ? true : false"
                  style="background-color: #fff;">{{
                    scope.row.val
                  }}
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" width="60"></el-table-column>

          </el-table>
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

import { checRulesCode, addRuleData, editRuleData, getRuleDataInfo, getFormulaList, getLineList, calculate } from "@/api/basicData/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      formulaList: [
        { formulaName: "无", id: "" }
      ],
      lines: [],
      productTypeList: [
        {
          label: "软管总成",
          value: "hose",
        }, {
          label: "钢管总成",
          value: "steel_pipe",
        },
      ],
      dataForm: {
        productType: "",
        customerDrawingNumber: "",
        materialCode: "",
        formulaId: "",
        customerProductNo: '',
        customerName: '',
        splitFlag: false
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
        productType: [
          { required: true, message: "请选择产品类型", trigger: "change" }
        ],
        customerDrawingNumber: [

          // { required: true, message: '请输入客户图号', trigger: 'blur' },
          { validator: this.formValidate('noSpace'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              checRulesCode(this.jnpf.specialCodeUrl(value), this.dataForm.id).then(res => {
                if (res.data) {
                  callback(new Error("客户图号重复"));
                } else {
                  callback();
                }
              }).catch(error => { callback(new Error(" ")); })
            }, trigger: 'blur'
          },
        ],
        materialCode: [
          { required: true, message: '请输入产品图号', trigger: 'blur' },

        ],
        customerProductNo: [
          { required: true, message: '请输入客户物料号', trigger: 'blur' },

        ]
      }
    }
  },
  watch: {
    'dataForm.materialCode'(val) {
      if (val && !val.includes('+WS')) this.dataForm.splitFlag = false
    }
  },
  methods: {
    handleCoun() {
      if (!this.dataForm.customerDrawingNumber) {
        this.$message({
          message: "请输入客户图号",
          type: 'error',
          duration: 1500,
        })
      } else {
        let obj = {
          "customerName": this.dataForm.customerName,
          "inputValue": this.dataForm.customerDrawingNumber,
          "lines": this.lines,
          "outputValue": this.dataForm.materialCode
        }
        calculate(obj).then(res => {
          console.log("计算结果", res);
          this.dataForm.materialCode = res.data.outputValue
          this.lines = res.data.lines
        })
      }
    },
    selectFormula(e) {
      console.log("请选择公式", e);
      this.dataForm.formulaId=e
      this.dataForm.materialCode = ""
      getLineList(e).then(res => {
        console.log("公式数据", res);
        this.lines = res.data
      })
    },
    handleClose() {
    },
    init(id, type) {

      this.formulaList = [
        { formulaName: "无", id: "" }
      ],
        this.dataForm = {
          productType: "",
          customerDrawingNumber: "",
          materialCode: "",
          formulaId: "",
          customerProductNo: '',
          customerName: '',
          splitFlag: false
        }
      this.lines = []
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
        let obj = {
          currentPage: 1,
          pageSize: -1,
          orderItems: [{
            asc: true,
            column: ""
          }],
          formulaNumber: "",
          formulaName: "",
        }
        getFormulaList(obj).then(res => {
          console.log("公式数据", res);
          console.log();
          this.formulaList = [...this.formulaList, ...res.data.records]
        })
        setTimeout(() => {
          if (this.dataForm.id) {
            getRuleDataInfo(this.dataForm.id).then(res => {
              console.log("详情", res);
              this.lines = res.data.lines
              if(!res.data.rule.formulaId){
                res.data.rule.formulaName="无"
                res.data.rule.formulaId=""
              }else{

              }
              this.dataForm = res.data.rule
              this.formLoading = false

            })
          } else {
            this.formLoading = false

          }
        }, 500);
      })
    },

    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let formMethod = this.dataForm.id ? editRuleData : addRuleData;
          let obj = {
            lines: this.lines,
            rule: this.dataForm,
          }
          console.log("提交数据", obj);
          formMethod(obj).then(res => {
            console.log(666, res);
            let msg = ""
            if (formMethod == editRuleData) {
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
  }
}
</script>
<style scoped>
.el-textarea__inner {
  background: #fff;
}</style>