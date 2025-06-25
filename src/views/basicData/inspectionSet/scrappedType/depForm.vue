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
        <el-form-item label="所属项目" prop="projectId" v-if="$store.getters.configData.system.project" >
          <template slot="label">
            所属项目<span class="required">*</span>
          </template>
          <el-select v-model="dataForm.projectId" placeholder="所属项目" style="width: 100%;" :disabled="abProjectId !== '1'">
            <el-option v-for="item in abProjectList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不良名称" prop="name">
          <template slot="label">
            不良名称<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入不良名称" maxlength="20" :disabled="btntype ? true : false" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <template slot="label" v-if="!isBOOS">
            单价<span class="required">*</span>
          </template>
          <el-input v-model="dataForm.price" placeholder="请输入单价" maxlength="20" />
        </el-form-item>
        <el-form-item label="不良类型" prop="type">
          <template slot="label">
            不良类型<span class="required">*</span>
          </template>
          <el-select v-model="dataForm.type" placeholder="不良类型" style="width: 100%;">
            <el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
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
import {
  addScrapCategoryData,
  editScrapCategoryData,
  checkScrapCategoryName
} from '@/api/basicData/index'
import formValidate from '@/utils/formValidate'
import AbProjectMixin from '@/mixins/generator/AbProjectMixin'
export default {
  mixins:[AbProjectMixin],
  data() {
    return {
      isProjectSwitch: '',
      
      visible: false,
      formLoading: false,
      btnLoading: false,
      isdisabled: false,
      title: '',
      dataForm: {
        projectId:'',
        name: '',
        price: '',
        type:'',
        id: ''
      },
      typeData: [
        {
          value: 'responsibility_fee',
          label: '责废'
        },
        {
          value: 'material_fee',
          label: '料废'
        },
        {
          value: 'rework',
          label: '返工'
        }
      ],
      codeConfig: {},
      btntype: false,

      dataRule: {
        name: [
          { required: true, message: '请输入不良名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id)
              if (this.dataForm.id) {
                checkScrapCategoryName(value, this.dataForm.id)
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('不良名称已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              } else {
                checkScrapCategoryName(value, '')
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('不良名称已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          }
        ],
        price: this.isBOOS?[]:[
          {
            required: true,
            message: '请输入单价',
            trigger: ['blur']
          },
          { validator: this.formValidate('positiveNumber', '', (errMsg) => { }), trigger: 'blur' },
        ],
        type: [
          {
            required: true,
            message: '请选择不良类型',
            trigger: ['change']
          },
        ],
        projectId: [
          {
            required: true,
            message: '请选择所属项目',
            trigger: ['change']
          },
        ],
      }
    }
  },
 async created() {
    await this.awaitAbProject()
    await this.getProjectList()
  },
  mounted () {
    console.log("this",this.isBOOS);
  },
  methods: {
    handleClose() { },

    init(row) {

      this.visible = true
      this.dataForm.id = row ? row.id :''
      this.title = !this.dataForm.id ? '新建不良原因' : '编辑不良原因'
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.dataForm = { ...row }
        } else {
          this.dataForm.projectId = this.abProjectId
        }
        
      })

    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          let formMethod = this.dataForm.id ? editScrapCategoryData : addScrapCategoryData
          formMethod(this.dataForm)
            .then((res) => {
              console.log(666, res)
              let msg = ''
              if (formMethod == editScrapCategoryData) {
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