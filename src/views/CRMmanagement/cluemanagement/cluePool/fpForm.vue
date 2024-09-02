<template>
  <div>
    <el-dialog title="分配线索" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
        <el-form-item label="负责人" prop="userId">
          <user-select v-model="dataForm.userId" placeholder="请选择负责人" clearable style="width: 100%" @change="hangleSelectSales">
          </user-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" append-to-body :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="tipsvisible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
      <div><img src="@/assets/images/importSuccess.gif" alt="" style="width:100px"><span class="import_t">
          分配成功啦！</span><span class="import_b">您还可以进行如下操作：</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('close', true)">返回列表</el-button>
        <el-button type="primary" @click="gotoclue">去往线索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Assignclues } from "@/api/basicData/index";

export default {
  data() {
    return {
      tipsvisible: false,
      visible: false,
      btnLoading: false,
      idlist: [],
      dataForm: {
        userId: ""
      },
      isdisabled: false,
      dataRule: {
        userId: [
          { required: true, message: '请选择负责人', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    gotoclue(){
      this.$router.replace('/CRMmanagement/cluemanagement/clue')
    },
    //负责人
    hangleSelectSales(e, r) {
      this.$nextTick(() => { this.$refs.dataForm.validateField("userId") });
    },
    init(idlist) {
      this.idlist = idlist
      this.visible = true
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let obj = {
            clueIdList: this.idlist,
            userId: this.dataForm.userId
          }
          Assignclues(obj).then(res => {
            this.tipsvisible=true
            this.visible = false
            this.btnLoading = false
            // this.$message({
            //   message: '分配成功',
            //   type: 'success',
            //   duration: 1500,
            //   onClose: () => {
            //     this.visible = false
            //     this.btnLoading = false
            //     this.$emit('close', true)
            //   }
            // })
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
.import_t {
  font-size: 22px;
  color: rgb(103, 194, 58);
  vertical-align: top;
  margin-top: 40px;
  display: inline-block;
  margin-left: 20px;
}

.import_b {
  font-size: 18px;
  /* color: #67c23a; */
  vertical-align: top;
  margin-top: 43px;
  display: inline-block;
}
</style>