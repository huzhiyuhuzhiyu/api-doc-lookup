<template>
  <el-dialog title="放入线索池" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll class="JNPF-dialog JNPF-dialog_center" width="500px">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-position="top" label-width="120px">
      <el-form-item label="放入线索池理由" prop="poolReason">
        <el-select v-model="dataForm.poolReason" placeholder="请选择放入线索池理由" clearable style="width: 100%;">
          <el-option v-for="(item, index) in sourceList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateCluemanagementpool } from "@/api/basicData/index";

export default {
  data() {
    return {
      sourceList: [
        { label: '联系不上客户', value: '1' },
        { label: '客户暂无需求', value: '2' },
        { label: '未满足客户需求', value: '3' },
        { label: '已购买其他家系统', value: '4' },
        { label: '其他', value: '5' },
      ],
      visible: false,
      btnLoading: false,
      idlist: [],
      dataForm: {
        poolReason: ""
      },
      isdisabled: false,
      dataRule: {
        poolReason: [
          { required: true, message: '请选择放入线索池理由', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
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
            poolReason: this.dataForm.poolReason
          }
          updateCluemanagementpool(obj).then(res => {
            this.$message({
              message: '加入成功',
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
