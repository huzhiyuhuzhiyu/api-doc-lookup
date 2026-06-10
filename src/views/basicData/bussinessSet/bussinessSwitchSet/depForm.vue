<template>
  <el-dialog :title="'编辑业务设置'" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">

      <el-form-item label="业务编码" prop="businessCode">
        <el-input v-model.trim="dataForm.businessCode" placeholder="请输入业务编码" maxlength="20" />
      </el-form-item>
      <el-form-item label="业务名称" prop="businessName">
        <el-input v-model.trim="dataForm.businessName" placeholder="请输入业务名称" maxlength="20" />
      </el-form-item>
      <!-- <el-form-item label="模式" prop="mode">
        <el-select v-model="dataForm.mode" placeholder="请选择状态" style="width: 100%;">
          <el-option v-for="(item, index) in modeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前值" prop="currentValue" v-if="dataForm.mode == 'select'">
        <el-select v-model="dataForm.currentValue" placeholder="请选择状态" style="width: 100%;">
          <el-option v-for="(item, index) in selectList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="openStateFlag" v-if="dataForm.mode == 'switch'">
        <el-switch v-model="dataForm.openStateFlag" active-color="#13ce66" inactive-color="#ff4949" :active-value="1"
          :inactive-value="0">
        </el-switch>
      </el-form-item> -->

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getBimBusinessInfo, editBimBusinessData } from "@/api/basicData/index";

export default {
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      stateList: [{
        label: "是",
        value: 1
      }, {
        label: "否",
        value: 0
      }],
      modeList: [{
        label: "开关",
        value: 'switch'
      }, {
        label: "选择",
        value: 'select'
      }],
      dataForm: {
        businessCode: "",
        businessName: "",
        // openStateFlag: "",
        // mode: "",
        // currentValue: ""
      },
      selectList: [],
      btntype: false,
      dataRule: {
        // code: [
        //   { required: true, message: '请输入业务编码', trigger: 'blur' },
        //   {
        //     validator: (rule, value, callback) => {
        //       console.log(value, this.dataForm.id);
        //       checkProductionLineCode(value, this.dataForm.id).then(res => {
        //         console.log('res===>', res);
        //         if (res.data) {
        //           callback(new Error("业务编码重复"));
        //         } else {
        //           callback();
        //         }
        //       }).catch(error => {
        //       })
        //     }, trigger: 'blur'
        //   },
        // ],
        // name: [
        //   { required: true, message: '请输入业务名称', trigger: 'blur' },
        // ],
        // state: [
        //   { required: true, message: "请选择状态", trigger: "change" }
        // ]
      },
    }
  },
  created() {
    
  },
  methods: {
    init(id,) {
      this.selectList=[]
      this.visible = true
      this.dataForm.id = id || ''
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getBimBusinessInfo(this.dataForm.id).then(res => {
            console.log("产线", res);
            this.dataForm = res.data
            if (res.data.selectedText) {
              let text = res.data.selectedText.split(",")
              let values = res.data.selectedValue.split(",")
              console.log(text, values);
              values.forEach((item, index) => {
                let objSelect = {
                  label: "",
                  value: "",
                }
                objSelect.label = text[index]
                objSelect.value = values[index]
                this.selectList.push(objSelect)
              });
            }
            // this.formLoading = false

          })
        } else {
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let obj = {
            businessConfig: this.dataForm
          }
          editBimBusinessData(obj).then(res => {
            console.log(666, res);
            this.visible = false
            this.btnLoading = false
            this.$emit('close', true)
            this.$message({
              message: "修改成功",
              type: 'success',
              duration: 1500,

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
