<template>
  <el-drawer :title="!dataForm.id ? '新建工位' : !btntype ? '编辑工位' : '查看工位' " :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll  width="600px">
    <template slot="title">
          <div class="custom_title">
            {{ title }}
          </div>
        </template>
    <div style="padding:10px;">
    <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
      label-width="120px">

      <el-form-item label="工位名称" prop="name">
        <el-input v-model.trim="dataForm.name" placeholder="请输入工位名称" maxlength="20" 
          :disabled="btntype ? true : false" />
      </el-form-item>
      <el-form-item label="工位编码" prop="code">
        <el-input v-model.trim="dataForm.code" placeholder="请输入工位编码" maxlength="20" 
        :disabled="btntype ? true : codeConfig.codeWay == 'auto' && !codeConfig.modifyFlag  ? true : false" />
      </el-form-item>
    
      <el-form-item label="状态" prop="state">
        <el-select v-model="dataForm.state" placeholder="请选择状态" style="width: 100%;" :disabled="btntype ? true : false">
          <el-option v-for="(item, index) in stateList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" :disabled="btntype ? true : false" placeholder="请输入备注"/>
      </el-form-item>
    </el-form>
    <span style="display:flex;justify-content: flex-end;" v-if="!btntype">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button :disabled="btntype ? true : false" type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </div>
  </el-drawer>
</template>

<script>
import { addBimWorkstation, updateBimWorkstation, getBimWorkstation, checkBimWorkstationCode } from "@/api/basicData/index";

export default {
  data() {
    return {
      title:'',
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      stateList: [{
        label: "启用",
        value: "enable"
      }, {
        label: "停用",
        value: "disabled"
      }],
      dataForm: {
        id:'',
        code: "",
        name: "",
        state:"",
        remark:''
      },
      codeConfig: {},
      btntype: false,
      dataRule: {
        code: [
          { required: true, message: '请输入工位编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id);
              checkBimWorkstationCode(value, this.dataForm.id).then(res => {
                console.log('res===>', res);
                if (res.data) {
                  callback(new Error("工位编码重复"));
                } else {
                  callback();
                }
              }).catch(error => {
              })
            }, trigger: 'blur'
          },
        ],
        name: [
          { required: true, message: '请输入工位名称', trigger: 'blur' },
        ],
        state:[
          {required:true,message:"请选择状态",trigger:"change"}
        ]
      },
    }
  },
  created() {
  },
  methods: {
    async fetchData(code) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (!data.modifyFlag && data.codeWay == 'auto') {
          this.dataForm.code = data.number

        }
      } catch (error) {}
    },
    init(id, type) {
      console.log(type,'type')
      this.visible = true
      this.dataForm.id = id || ''
     
      if (type == "edit" || type == "add") {
        this.btntype = false
      } else if (type == "look") {
        this.btntype = true
      }
      this.title = !this.dataForm.id ? '新建工位' : !this.btntype ? '编辑工位' : '查看工位'
      // this.formLoading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          getBimWorkstation(this.dataForm.id).then(res => {
            console.log("工位", res);
            this.dataForm = res.data
            // this.formLoading = false

          })
        } else {
          this.fetchData('bm_sc_gw')
          this.formLoading = false
        }
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          let formMethod = this.dataForm.id ? updateBimWorkstation : addBimWorkstation;

          formMethod(this.dataForm).then(res => {
            console.log(666, res);
            let msg = ""
            if (formMethod == updateBimWorkstation) {
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
<style lang="scss" scoped>
.custom_title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
}
</style>

