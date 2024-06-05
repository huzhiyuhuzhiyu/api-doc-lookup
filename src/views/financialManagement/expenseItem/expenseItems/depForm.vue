<template>
  <el-dialog :title="!dataForm.id ? '新建费用项目' : '编辑费用项目'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="800px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="itemName">
            <el-input v-model="dataForm.itemName" placeholder="请输入项目名称" maxlength="20"
              :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="itemType">
            <el-select placeholder="请选择项目类型" v-model="dataForm.itemType" clearable>
              <el-option v-for="(item, index) in itemTypeList" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        
        <!-- <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number  :min="1" :max="999999" v-model="dataForm.sort" controls-position="right" />
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item label="单价" prop="price">
            <el-input v-model="dataForm.price" placeholder="请输入单价" maxlength="20" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单位" prop="unit">
            <el-input v-model="dataForm.unit" placeholder="请输入单位" maxlength="20" :disabled="btntype ? true : false" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200"
              :disabled="btntype ? true : false" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addFinExpenseItem, editFinExpenseItem, getfinExpenseItemDetail, checkFinExpenseItem } from '@/api/expenseItem/index'
import formValidate from "@/utils/formValidate";
export default {
  components: {
  },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      dataForm: {
        remark: '',
        itemName: '',
        price: '',
        sort: '',
        unit: '',
        id: '',
        itemType:""

      },
      itemTypeList:[
        {label:"普通项目",value:"ordinary"},
        {label:"深钻孔",value:"drill"},
        {label:"普通刀具",value:"cutter"},
      ],
      btntype: false,
      dataRule: {
        itemName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkFinExpenseItem(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("项目名称重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        itemType: [
          { required: true, message: "请选择项目类型", trigger: "change" }
        ],
        price: [
          { required: true, message: "请输入单价", trigger: "change" },
          { validator: this.formValidate({ type: 'decimal', params: [10, 4, "", (errMsg) => { this.$message.error('单价' + errMsg) }] }), trigger: 'blur' },
          { validator: this.formValidate('noZero', '', (errMsg) => { this.$message.error('单价：不能为0') }), trigger: 'blur' }
        ],
      },
    }
  },
  created() {
  },
  methods: {

    init(id, type) {
      this.visible = true
      this.dataForm.id = id || ''
      if (type == "edit" || type == "add") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true

      }
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getfinExpenseItemDetail(this.dataForm.id).then(res => {
            console.log("产线---", res);
            this.dataForm = res.data
            this.formLoading = false
            this.loading = false
          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      let queryData = {
        finExpenseItem: this.dataForm
      }
      let msg = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (msg) {
            this.btnLoading = true;
            let formMethod = this.dataForm.id ? editFinExpenseItem : addFinExpenseItem

            formMethod(queryData).then(res => {
              console.log(666, res);
              let msg = ""
              if (formMethod == editFinExpenseItem) {
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

::v-deep#table .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>