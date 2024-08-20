<template>
  <el-drawer @closed="cancelFun" :title="!dataForm.id ? '新建仓库' : '开启仓库状态'" :close-on-click-modal="false"
    :close-on-press-escape="false" :visible.sync="visible" lock-scroll width="500px" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :rules="dataRule" label-position="top"
        label-width="120px" :hide-required-asterisk="true">
        <el-form-item label="仓库名称" prop="warehouseName">
          <template slot="label">
            仓库名称
            <span class="required">*</span>
          </template>
          <el-input v-model="dataForm.warehouseName" placeholder="请输入仓库名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="仓库编码" prop="warehouseCode">
          <template slot="label">
            仓库编码
            <span class="required">*</span>
          </template>
          <el-input v-model="dataForm.warehouseCode" placeholder="请输入仓库编码" maxlength="20" disabled />
        </el-form-item>

        <el-form-item label="仓库图标">
          <template slot="label">
            仓库图标
            <span class="required">*</span>
          </template>
          <el-row type="flex">
            <div style="flex:1">
              <el-input v-model="dataForm.icon" placeholder="请选择图标" readonly :suffix-icon="dataForm.icon">
                <el-button slot="append" @click="openIconBox">选择</el-button>
              </el-input>
            </div>
            <!-- <el-color-picker v-model="dataForm.propertyJson.iconBackgroundColor" :predefine="[
              '#188ae2',
              '#35b8e0',
              '#26bf8c',
              '#f9c851',
              '#ff5b5b',
              '#5b69bc',
              '#ff8acc',
              '#3b3e47',
              '#282828'
            ]" /> -->
          </el-row>
        </el-form-item>
      </el-form>
      <span class="button-bottom">
        <el-button @click="cancelFun">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          提交
        </el-button>
      </span>
    </div>
    <icon-box :visible.sync="iconBoxVisible" ref="iconBox" :current="dataForm.icon" @choiceIcon="choiceIcon" />
  </el-drawer>
</template>

<script>
import {
  getClassAttributeInfo,
  updataClassAttribute,
  delBimProductAttributes,
  addClassAttributes,
  getbimProductAttributesList,
  checkClassAttributeCode,
  enableClassAttributeState
} from '@/api/masterDataManagement/index'
import iconBox from '@/components/JNPF-iconBox'

export default {
  components: { iconBox },
  data() {
    return {
      visible: false,
      formLoading: false,
      btnLoading: false,
      iconBoxVisible: false,
      dataForm: {
        warehouseName: '',
        remark: '',
        warehouseCode: '',
        propertyJson: {
          moduleId: '',
          iconBackgroundColor: '',
          isTree: 0
        },
        sortCode: 0
      },
      title: '',
      isdisabled: false,
      organizeIdTree: [],
      btntype: '',
      autoCode: '',
      dataRule: {
        warehouseCode: [
          { required: true, message: '请输入仓库编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (this.dataForm.code === this.autoCode) {
                callback()
              } else {
                if (this.dataForm.id) {
                  checkClassAttributeCode(value, this.dataForm.id)
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此类型编码已存在'))
                      }
                    })
                    .catch((err) => {
                      callback(new Error(' '))
                    })
                } else {
                  checkClassAttributeCode(value, '')
                    .then((res) => {
                      if (!res.data) {
                        callback()
                      } else {
                        callback(new Error('此仓库编码已存在'))
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
        warehouseName: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' },
          // { validator: this.formValidate('fullName', '名称不能含有特殊符号'), trigger: 'blur' },
          { max: 50, message: '名称最多为50个字符！', trigger: 'blur' }
        ],
        icon: [{ required: true, message: '请输入仓库图标', trigger: 'change' }]
      },
      classAttribute: {}
    }
  },
  methods: {
    init(row, btntype) {
      this.classAttribute = row
      this.visible = true
      if (btntype == 'edit') {
        // getClassAttributeInfo(id).then((res) => {
        this.dataForm.code = row.code
        this.autoCode = row.code
        this.dataForm.warehouseCode = row.warehouseCode ? row.warehouseCode : row.code
        this.dataForm.warehouseName = row.warehouseName ? row.warehouseName : row.name

        this.dataForm.remark = row.remark
        this.dataForm.id = row.id
        this.title = '开启仓库状态'
        // })
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
      if (!this.dataForm.icon) return this.$message.error('仓库图标未选择')
      this.classAttribute.warehouseCode = this.dataForm.warehouseCode
      this.classAttribute.warehouseName = this.dataForm.warehouseName
      this.$refs['dataForm'].validate((valid) => {
        let obj = {
          classAttribute: this.classAttribute,
          directory: {
            category: 'Web',
            description: '',
            enCode: this.dataForm.warehouseCode,
            enabledMark: 1,
            fullName: this.dataForm.warehouseName,
            icon: this.dataForm.icon,
            id: '',
            isButtonAuthorize: 0,
            isColumnAuthorize: 0,
            isDataAuthorize: 0,
            isFormAuthorize: 0,
            linkTarget: '_self',
            parentId: '568721982921638149',
            propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
            systemId: '309228585019769285',
            type: 1,
            urlAddress: ''
          },
          menuList: [
            {
              category: 'Web',
              description: '',
              enCode: 'dbIncomAndOutInventory',
              enabledMark: 1,
              fullName: `待办出入库`,
              icon: 'icon-ym icon-ym-webForm',
              id: '',
              isButtonAuthorize: 1,
              isColumnAuthorize: 1,
              isDataAuthorize: 1,
              isFormAuthorize: 1,
              linkTarget: '_self',
              parentId: '',
              propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
              sortCode: 10,
              systemId: '309228585019769285',
              type: 2,
              urlAddress:
                'warehouseManagement/${' +
                this.classAttribute.code +
                '}/dbIncomAndOutInventory' +
                '?' +
                this.classAttribute.code
            },
            {
              category: 'Web',
              description: '',
              enCode: 'directInandOutWarehouse',
              enabledMark: 1,
              fullName: `直接出入库`,
              icon: 'icon-ym icon-ym-webForm',
              id: '',
              isButtonAuthorize: 1,
              isColumnAuthorize: 1,
              isDataAuthorize: 1,
              isFormAuthorize: 1,
              linkTarget: '_self',
              parentId: '',
              propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
              sortCode: 20,
              systemId: '309228585019769285',
              type: 2,
              urlAddress:
                'warehouseManagement/${' +
                this.classAttribute.code +
                '}/directInandOutWarehouse' +
                '?' +
                this.classAttribute.code
            },
            {
              category: 'Web',
              description: '',
              enCode: 'inventoryList',
              enabledMark: 1,
              fullName: '出入库列表',
              icon: 'icon-ym icon-ym-webForm',
              id: '',
              isButtonAuthorize: 1,
              isColumnAuthorize: 1,
              isDataAuthorize: 1,
              isFormAuthorize: 1,
              linkTarget: '_self',
              parentId: '',
              propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
              sortCode: 30,
              systemId: '309228585019769285',
              type: 2,
              urlAddress:
                'warehouseManagement/${' + this.classAttribute.code + '}/inventoryList' + '?' + this.classAttribute.code
            },
            {
              category: 'Web',
              description: '',
              enCode: 'inventoryDetaisList',
              enabledMark: 1,
              fullName: '出入库明细',
              icon: 'icon-ym icon-ym-webForm',
              id: '',
              isButtonAuthorize: 1,
              isColumnAuthorize: 1,
              isDataAuthorize: 1,
              isFormAuthorize: 1,
              linkTarget: '_self',
              parentId: '',
              propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
              sortCode: 40,
              systemId: '309228585019769285',
              type: 2,
              urlAddress:
                'warehouseManagement/${' +
                this.classAttribute.code +
                '}/inventoryDetaisList' +
                '?' +
                this.classAttribute.code
            },
            {
              category: 'Web',
              description: '',
              enCode: 'transferManagement',
              enabledMark: 1,
              fullName: '调拨管理',
              icon: 'icon-ym icon-ym-webForm',
              id: '',
              isButtonAuthorize: 1,
              isColumnAuthorize: 1,
              isDataAuthorize: 1,
              isFormAuthorize: 1,
              linkTarget: '_self',
              parentId: '',
              propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
              sortCode: 50,
              systemId: '309228585019769285',
              type: 2,
              urlAddress:
                'warehouseManagement/${' +
                this.classAttribute.code +
                '}/transferManagement' +
                '?' +
                this.classAttribute.code
            },
            {
              category: 'Web',
              description: '',
              enCode: 'inventory',
              enabledMark: 1,
              fullName: '库存查询',
              icon: 'icon-ym icon-ym-webForm',
              id: '',
              isButtonAuthorize: 1,
              isColumnAuthorize: 1,
              isDataAuthorize: 1,
              isFormAuthorize: 1,
              linkTarget: '_self',
              parentId: '',
              propertyJson: '{"moduleId":"","iconBackgroundColor":"","isTree":0}',
              sortCode: 60,
              systemId: '309228585019769285',
              type: 2,
              urlAddress:
                'warehouseManagement/${' + this.classAttribute.code + '}/inventory' + '?' + this.classAttribute.code
            }
          ]
        }

        if (valid) {
          this.btnLoading = true

          let formMethod = this.btntype == 'edit' ? enableClassAttributeState : addClassAttributes

          if (formMethod == enableClassAttributeState) {
            formMethod(obj)
              .then((response) => {
                this.$message({
                  message: '开启成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.btnLoading = false
                    this.$emit('close', true)
                    location.reload()
                  }
                })
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    openIconBox() {
      this.iconBoxVisible = true
    },
    choiceIcon(value) {
      this.dataForm.icon = value
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
