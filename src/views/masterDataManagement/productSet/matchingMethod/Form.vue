<template>
  <el-drawer @closed="cancelFun" :title="!dataForm.id ? '新建配对方式' : '编辑配对方式'" :wrapperClosable="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll width="500px" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入名称" maxlength="20" />
        </el-form-item>

        <el-form-item label="单位" prop="unit">
          <el-select v-model="dataForm.unit" placeholder="请选择单位" style="width: 100%;">
            <el-option v-for="item in unitList" size="small" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select> 
        </el-form-item>
        <el-form-item label="配对数量" prop="quantity">
          <el-input v-model="dataForm.quantity" placeholder="请输入配对数量" maxlength="20" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" :rows="3" maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span class="button-bottom">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交
        </el-button>
      </span>
    </div>
  </el-drawer>
</template>

<script>
import {
  getClassAttributeInfo,
  updataBimPairingMode,
  delBimProductAttributes,
  addBimPairingMode,
  getbimProductAttributesList,
  checkBimPairingModeCode
} from '@/api/masterDataManagement/index'
import { getUnitData } from '@/api/basicData/materialSettings'
export default {
  components: {},
  data() {
    var checkQuantity = (rule, value, callback) => {
      if (/^(?:[0-9]\d*)$/.test(value) == false) {
        callback(new Error('请输入整数'))
      } else if (Number(value) == 0) {
        callback(new Error('配对数量不能为0'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      iconBoxVisible: false,
      dataForm: {
        name: '',
        remark: '',
        quantity: '',

      },
      title: '',
      isdisabled: false,
      organizeIdTree: [],
      btntype: '',
      autoCode: '',
      dataRule: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.code === this.autoCode) {
                callback()
              } else {
                if (this.dataForm.id) {
                  checkBimPairingModeCode(value, this.dataForm.id)
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此名称已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                } else {
                  checkBimPairingModeCode(value, '')
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此名称已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                }
              }
            },
            trigger: 'blur'
          }
        ],
        unit: [
          {
            required: true,
            message: '请选择单位',
            trigger: ['change']
          },
          
        ],
        quantity: [
          {
            required: true,
            message: '请输入配对数量',
            trigger: ['blur']
          },
          { validator: checkQuantity, trigger: 'blur' }
        ],
      },
      unitList:[],
      listQuery: {
        unitCode: '',
        name: '',
        orderItems: [
          {
            asc: false,
            column: ''
          },
          {
            asc: false,
            column: 'create_time'
          }
        ],
        pageNum: 1,
        pageSize: 20
      },
    }
  },
  methods: {
    getUnitList(){
      getUnitData(this.listQuery).then(res=>{
        console.log("单位",res);
        this.unitList=res.data.records||[]
      })
    },
    choiceIcon(value) {
      this.dataForm.icon = value
    },
    init(row, btntype) {
      this.visible = true
      this.getUnitList()
      if (btntype == 'add') {
        this.dataForm = {
          name: '',
          remark: '',
          quantity: ''
        }
        this.title = '新建配对方式'
      } else if (btntype == 'edit') {
        this.dataForm = { ...row }
        this.title = '编辑配对方式'
      }
      this.btntype = btntype
    },
    cancelFun() {
      this.visible = false

      this.$refs['dataForm'].resetFields()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        this.dataForm.quantity = Number(this.dataForm.quantity)
        if (valid) {
          this.btnLoading = true

          let formMethod = this.btntype == 'edit' ? updataBimPairingMode : addBimPairingMode

          if (formMethod == updataBimPairingMode) {
            formMethod(this.dataForm)
              .then((response) => {
                this.$message({
                  message: '修改成功',
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
          } else {
            formMethod(this.dataForm)
              .then((res) => {
                this.$message({
                  message: '新建成功',
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
