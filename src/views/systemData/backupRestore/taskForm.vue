<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? '新建任务' : '编辑任务'" />
        <div class="options">
          <el-button type="primary" @click="dataFormSubmit()" :loading="btnLoading">
            {{ $t('common.confirmButton') }}</el-button>
          <el-button @click="goBack()">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main">
        <el-row :gutter="15">
          <!-- <el-col > -->
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" size="small" label-width="100px"
              label-position="top" @submit.native.prevent>
              <el-col :span="12">
                <el-form-item label="任务名称" prop="taskName">
                  <el-input v-model="dataForm.taskName" placeholder="任务名称" maxlength="100">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="Cron表达式" prop="cron">
                  <el-input v-model="dataForm.cron" placeholder="Cron表达式" readonly>
                    <el-button slot="append" icon="el-icon-edit-outline" @click="showDialog">
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="生效开始时间" prop="effectiveStartTime">
                  <el-time-picker v-model="dataForm.effectiveStartTime"  style="width: 100%;" placeholder="请选择生效开始时间">
                  </el-time-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="生效结束时间" prop="effectiveEndTime">
                  <el-time-picker v-model="dataForm.effectiveEndTime"  style="width: 100%;" placeholder="请选择生效结束时间">
                  </el-time-picker>
                </el-form-item>
              </el-col>

            </el-form>
          <!-- </el-col> -->
        </el-row>
      </div>
      <el-dialog title="Cron表达式" :visible.sync="showCron" :close-on-click-modal="false"
        class="JNPF-dialog JNPF-dialog_center" lock-scroll append-to-body width="700px" @closed="showCrontab = false">
        <vcrontab ref="vcrontab" @hide="showCron = false" @fill="crontabFill" :expression="dataForm.cron"
          :hideComponent="['second', 'min']" v-if="showCrontab" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCron = false">{{ $t('common.cancelButton') }}
          </el-button>
          <el-button type="warning" @click="resetCrontab">重 置</el-button>
          <el-button type="primary" @click="getCrontabValue">{{ $t('common.confirmButton') }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import { detailTask, updateTask, addTask } from '@/api/systemData/dataBackupRestore'
import vcrontab from "vcrontab"

export default {
  components: { vcrontab },
  data() {
    return {
      showCron: false,
      showCrontab: true,
      dataForm: {
        id: '',
        taskName: '',
        description: '',
        cron: '',
        effectiveStartTime: '',
        effectiveEndTime: '',
      },
      dataRule: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
        ],

        cron: [
          { required: true, message: 'Cron表达式不能为空', trigger: 'click' }
        ],
        effectiveStartTime:[
          { validator: this.checkDate(), trigger: 'change' },
        ],
        effectiveEndTime:[
          { validator: this.checkDate2(), trigger: 'change' },
        ],
      },
      formVisible: false,
      btnLoading: false,
    }
  },
  computed: {
  },
  methods: {
    checkDate() {
      return (rule, value, callback) => {
        let msg = `有效开始时间不能超过有效结束时间`
        if (!value) { callback() }
        else {
          if (new Date(value) > new Date(this.dataForm.effectiveEndTime)) {
            // this.$message.error(msg)
            callback(new Error(msg));
          } else {
            callback();
          }
        }
      };
    },
    checkDate2() {
      return (rule, value, callback) => {
        let msg = `有效结束时间不能小于有效开始时间`
        if (!value) { callback() }
        else {
          if (new Date(value) < new Date(this.dataForm.effectiveStartTime)) {
            callback(new Error(msg));
          } else {
            callback();
          }
        }
      };
    },
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm = {
        id: '',
        taskName: '',
        description: '',
        cron: '',
        effectiveStartTime: '',
        effectiveEndTime: '',
      }
      this.dataForm.id = id || ''
      if (id) {
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          detailTask(id).then(res => {
            this.dataForm = res.data
          })
        })
      }
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let query = { ...this.dataForm }
          const formMethod = this.dataForm.id ? updateTask : addTask
          formMethod(query).then((res) => {
            this.$message({
              message: res.msg === 'Success' && this.dataForm.id ? '编辑成功' : '新建成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.btnLoading = false
                this.$emit('close', true)
              }
            })
          }).catch(() => { this.btnLoading = false })
        }
      })
    },


    getCrontabValue() {
      this.$refs.vcrontab && this.$refs.vcrontab.submitFill()
    },
    resetCrontab() {
      this.$refs.vcrontab && this.$refs.vcrontab.clearCron()
    },
    crontabFill(value) {
      this.dataForm.cron = value
    },
    showDialog() {
      this.showCron = true
      this.showCrontab = true
    }
  }
}
</script>
<style lang="scss" scoped>
>>>.el-dialog__body {
  padding: 10px 10px 0 !important;
}

::v-deep .JNPF-common-page-header {
  padding: 5px 10px;
}

.delBtn {
  text-align: right;
}

::v-deep #pane-0 .el-form .el-form-item {
  display: none;
}

::v-deep #pane-0 .el-form .el-form-item {
  &:last-child {
    display: block;
  }
}
::v-deep .pop_btn{
  display: none;
}
</style>