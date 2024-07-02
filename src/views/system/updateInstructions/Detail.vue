<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main flow-form-main">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" content="更新说明详情" />
       
      </div>
      <el-row class="main">
        <el-col :span="14" :offset="5">
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="mt-20" label-width="120px"
            @submit.native.prevent>
            <el-col :span="24">
              <el-form-item label="更新日期" prop="updateDate">
                <el-date-picker v-model="dataForm.updateDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期时间"
                  defaule-value="defaultValue" readonly>
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="更新说明" prop="updateContent">
                <el-input v-model="dataForm.updateContent" type="textarea" :autosize="{ minRows: 22 }" placeholder="请输入"
                  clearable :style="{ width: '100%' }" maxlength="500" readonly>
                </el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>

    </div>
  </transition>
</template>

<script>
import { deleteInstructionsList,detailInstructionsList,editInstructionsList,addInstructionsList,getInstructionsList } from '@/api/masterDataManagement/index.js'

export default {
  components: {},
  data() {
    return {
      showCron: false,
      showCrontab: true,
      dataForm: {
        id: '',
        updateDate: '',
        updateContent: ''
      },
      dataRule: {
        updateDate: [
          { required: true, message: '更新日期不能为空', trigger: 'blur' },
        ],
        updateContent: [
          { required: true, message: '更新说明不能为空', trigger: 'blur' },
        ],

      },
      formVisible: false,
      btnLoading: false,
      taskOptions: []
    }
  },
  computed: {

  },
  methods: {
    goBack() {
      this.$emit('close')
    },
    init(id) {
      this.dataForm = {
        id: '',
        fullName: '',
        enCode: '',
        executeType: '1',
        description: '',
        executeContent: {
          cron: '',
          interfaceId: '',
          interfaceName: '',
          parameter: [],
          localHostTaskId: '',
        }
      }
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          detailInstructionsList(this.dataForm.id).then(res => {
            this.dataForm = res.data

          })
        }
      })
    },

  }
}
</script>
<style lang="scss" scoped>
>>>.el-dialog__body {
  padding: 10px 10px 0 !important;
}

>>>.popup-main {
  .pop_btn {
    display: none !important;
  }

  .popup-result:nth-child(2) {
    margin-bottom: 2px;
  }
}

.delBtn {
  text-align: right;
}
</style>