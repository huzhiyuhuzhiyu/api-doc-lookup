<template>
  <el-drawer :title="!dataForm.id ? '新建不良原因' : '编辑不良原因'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll width="600px" @close="handleClose" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding: 10px;">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" >
           <el-form-item label="内容类型" prop="contentType">
          <el-select v-model="dataForm.contentType" placeholder="内容类型" style="width: 100%;">
            <el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入内容名称" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>
       
     
        <el-form-item label="内容详情" prop="contentText">
          <el-input v-model="dataForm.contentText" type="textarea" :rows="3" maxlength="200" placeholder="请输入内容详情" />
        </el-form-item>
      </el-form>
    </div>

    <span class="button-bottom">
      <el-button @click="visible = false">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
        提交
      </el-button>
    </span>
  </el-drawer>
</template>

<script>
import {equContentSettingsList,delEquContentSettings ,addEquContentSettings,editEquContentSettings,equContentSettingsDetail} from '@/api/bimPropertyCategory/index'
 
import formValidate from '@/utils/formValidate'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
export default {
  mixins:[AbProjectMixin],
  data() {
    return {
            typeData: [
                      {value: 'abnormal',label: '异常'},
                      {value: 'repair',label: '维修'},
                      {value: 'inspection',label: '点检'},
                      {value: 'maintenance',label: '保养'},
                    ],
      isProjectSwitch: '',
      
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      title: '',
      dataForm: {
        name: '',
        contentType: '',
        contentText:'',
        id: ''
      },
      typeData: [
        {value: 'abnormal',label: '异常'},
        {value: 'repair',label: '维修'},
        {value: 'inspection',label: '点检'},
        {value: 'maintenance',label: '保养'},
      ],
      codeConfig: {},
      btntype: false,

      dataRule: {
        name: [
          { required: true, message: '请输入内容名称', trigger: 'blur' },
          // {
          //   validator: (rule, value, callback) => {
          //     console.log(value, this.dataForm.id)
          //     if (this.dataForm.id) {
          //       checkScrapCategoryName(value, this.dataForm.id)
          //         .then((res) => {
          //           if (!res.data) {
          //             callback()
          //           } else {
          //             callback(new Error('不良名称已存在'))
          //           }
          //         })
          //         .catch((err) => {
          //           callback(new Error(' '))
          //         })
          //     } else {
          //       checkScrapCategoryName(value, '')
          //         .then((res) => {
          //           if (!res.data) {
          //             callback()
          //           } else {
          //             callback(new Error('不良名称已存在'))
          //           }
          //         })
          //         .catch((err) => {
          //           callback(new Error(' '))
          //         })
          //     }
          //   },
          //   trigger: 'blur'
          // }
        ],
          contentText: [
          { required: true, message: '请输入内容详情', trigger: 'blur' },
        ],
        contentType: [
          {
            required: true,
            message: '请选择内容类型',
            trigger: ['change']
          },
        ],
      
      }
    }
  },
 async created() {
  },
  methods: {
    handleClose() { },

    init(row) {

      this.visible = true
      this.dataForm.id = row ? row.id :''
      this.title = !this.dataForm.id ? '新建内容配置' : '编辑内容配置'
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.dataForm = { ...row }
        } 
        
      })

    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? editEquContentSettings : addEquContentSettings
          this.$set(this.dataForm,'equipmentType','tool')
          formMethod(this.dataForm)
            .then((res) => {
              console.log(666, res)
              let msg = ''
              if (formMethod == editEquContentSettings) {
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
            })
            .catch(() => {
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
  margin-left: -12px;
}

.required {
  color: red;
  margin-left: 4px;
}

.button-bottom {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
</style>