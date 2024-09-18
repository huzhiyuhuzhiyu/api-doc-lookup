<template>
  <!-- 选择模版 -->
  <el-dialog title="选择打印模版" :close-on-click-modal="false" :close-on-press-escape="false" @close="$emit('closePrint')" :visible.sync="visible"
    lock-scroll class="JNPF-dialog JNPF-dialog_center" width="600px">
    <el-row :gutter="20">
      <el-form ref="printListForm" :model="printDataForm" :rules="dataRule" label-width="120px" label-position="left">
        <el-col :span="16">
          <el-form-item label="打印模版：" prop="enCode">
            <el-select v-model="printDataForm.enCode" placeholder="选择打印模版">
              <el-option :key="item.id" :label="item.fullName" :value="item.printBus" v-for="item in printList" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('closePrint')">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" :disabled="btnLoading" @click="printSubmit()">
        确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getPrintList } from '@/api/system/printDev'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    printQuery: {
      type: Object,
      default: () => ({})
    },
    enCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      btnLoading: false,
      printVisible: false,
      printDataForm: {
        enCode: ''
      },
      printList: [],
      dataRule: {
        enCode: [
          { required: true, message: '请选择打印模版', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    init() {
      getPrintList(this.printQuery).then(res => {
        if (res.data) {
          if (res.data.hasOwnProperty(this.enCode)) {
            this.printList = res.data[this.enCode]
          }
        }
      }).catch(() => { })
    },
    printSubmit() {
      this.btnLoading = true
      this.$refs.printListForm.validate((valid) => {
        if (valid) {
          this.btnLoading = false
          this.$emit('printSubmit', this.printDataForm.enCode)
        } else {
          this.btnLoading = false
        }
      })
    },
  }
}
</script>