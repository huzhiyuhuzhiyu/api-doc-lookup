<template>
  <transition name="el-zoom-in-center">
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-page-header">
        <el-page-header @back="goBack" :content="!dataForm.id ? `新建检验工具档案` : disabled ? '查看检验工具档案' : '编辑检验工具档案'" />
        <div class="options">
          <el-button type="primary" v-if="!disabled" :disabled="disabled" :loading="btnLoading"
            @click="handleConfirm()">
            提交
          </el-button>
          <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
        </div>
      </div>
      <div class="main" v-loading="formLoading">
        <el-tabs v-model="activeName">
          <el-tab-pane label="基础信息" name="jcInfo">
            <el-collapse v-model="activeNames">
              <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo">
                <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" label-position="top">
                  <el-row :gutter="20" class="custom-row">
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检验工具分类" prop="categoryName" ref="categoryName">
                        <ComSelect-list :isdisabled="disabled" v-model="dataForm.categoryName" placeholder="请选择检验工具分类"
                          auth @change="onOrganizeChange" :title="'选择检验工具分类'" :method="getCategoryTrees"
                          :requestObj="requestObjTwo" :paramsObj="{}" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检验工具名称" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入检验工具名称" maxlength="20" :disabled="disabled" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检验工具编码" prop="code">
                        <el-input v-model="dataForm.code" placeholder="请输入检验工具编码" maxlength="20" :disabled="disabled
                            ? true
                            : codeConfig.codeWay == 'auto' && codeConfig.modifyFlag == true
                              ? false
                              : true
                          " oninput="value = value.replace(/[\p{P}\p{C}\p{S}\p{M}]/gu,'')" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检验工具规格" prop="specModel">
                        <el-input v-model="dataForm.specModel" placeholder="请输入检验工具规格" :disabled="disabled"
                          maxlength="50" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="长" prop="equLong">
                        <el-input v-model="dataForm.equLong" placeholder="请输入长" :disabled="disabled">
                          <template #append>
                            （cm）
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="宽" prop="width">
                        <el-input v-model="dataForm.width" placeholder="请输入宽" :disabled="disabled">
                          <template #append>
                            （cm）
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="高" prop="height">
                        <el-input v-model="dataForm.height" placeholder="请输入高" :disabled="disabled">
                          <template #append>
                            （cm）
                          </template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="使用人" prop="userId">
                        <user-select v-model="dataForm.userId" placeholder="请选择所属人员" clearable style="width: 100%;"
                          :disabled="disabled" @change="getuserDepartment"></user-select>
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="8">
                      <el-form-item label="使用部门" prop="userDepartmentName">
                        <el-input v-model="dataForm.userDepartmentName" readonly placeholder="请输入使用部门"
                          :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="用途" prop="usin">
                        <el-input v-model="dataForm.usin" maxlength="200" placeholder="请输入用途" :disabled="disabled" />
                      </el-form-item>
                    </el-col>

                    <el-col :sm="6" :xs="24">
                      <el-form-item label="检验工具状态" prop="state">
                        <el-select v-model="dataForm.state" placeholder="请选择检验工具状态" clearable :disabled="true"
                          style="width: 100%;">
                          <el-option v-for="(item, index) in equipmentStatusList" :key="index" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :sm="6" :xs="24">
                      <el-form-item label="体积" prop="unitVolume">
                        <el-input v-model="dataForm.unitVolume" placeholder="请输入体积" :disabled="disabled"
                          maxlength="20" />
                      </el-form-item>
                    </el-col>
                    <el-col :sm="24" :xs="24">
                      <el-form-item label="备注" prop="remark">
                        <el-input class="shuru" v-model="dataForm.remark" placeholder="请输入备注" type="textarea" :rows="2"
                          maxlength="200" :disabled="disabled" style="width: 100%;" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
          <el-tab-pane label="附件" name="annex">
            <UploadWj v-model="datafilelist" :disabled="disabled" :detailed="disabled"></UploadWj>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import { editEquEquipment, saveEquEquipment, getEquEquipmentInfo } from '@/api/basicData/index'
import { getCategoryTrees, getUserList, checkEquEquipmentCode } from '@/api/basicData/index'

import { getEffectUnitList } from '@/api/basicData/materialSettings'

import formValidate from '@/utils/formValidate'
export default {
  data() {
    return {
      action: 'https://jsonplaceholder.typicode.com/posts/', // 后期替换上传接口
      datafilelist: [],
      activeName: 'jcInfo',
      activeNames: ['productInfo', 'basicInfo'],
      title: '',
      getCategoryTrees,
      billingTypeList: [],
      paymentMethodList: [],
      listQuery: {
        keyword: ''
      },
      typeOptions: [],
      nodeId: -1,

      visible: false,
      btnLoading: false,
      formLoading: false,
      codeConfig: {},
      dataForm: {
        state: 'normal',
        id: '',
        name: null, //设备名称
        code: null, //设备编码
        drawingNo: null, //图号
        unitVolume: null, //单位
        remark: '', //备注
        userId: '', //人员id
        organize: '', //部门名称
        userDepartmentName: '',
        userDepartmentId: '',
        categoryName: '',
        attachmentList: []
      },
      parentId: '',
      // 设备状态
      equipmentStatusList: [
        {
          value: 'normal',
          label: '正常'
        },
        {
          value: 'use',
          label: '领用'
        },
        {
          value: 'verification',
          label: '检定'
        },
        {
          value: 'discard',
          label: '报废'
        }
      ],
      categoryIdProps: {
        label: 'name',
        value: 'id',
        children: 'childrenList'
      },
      disabled: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      requestObjTwo: {
        page: 1,
        limit: 999,
        keyword: '',
        classAttribute: 'ispection_tools'
      },
      partnerList: [],
      dataRule: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              console.log(value, this.dataForm.id)
              checkEquEquipmentCode(value, this.dataForm.id, 'inspect')
                .then((res) => {
                  console.log('res===>', res)
                  if (res.data) {
                    callback(new Error('检验工具编码重复'))
                  } else {
                    callback()
                  }
                })
                .catch((error) => { })
            },
            trigger: 'blur'
          }
        ],
        state: [{ required: true, message: '请选择检验工具状态', trigger: 'change' }],
        categoryName: [{ required: true, message: '请选择检验工具所属分类', trigger: 'change' }],
        unitVolume: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        equLong: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        width: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }],
        height: [{ validator: formValidate({ type: 'decimal', params: [10, 2] }), trigger: 'blur' }]
      }
    }
  },
  created() { },
  methods: {
    async fetchData(code, flag) {
      try {
        const data = await this.jnpf.getBillRuleConfigFun(code)
        this.codeConfig = data
        if (flag) {
          this.dataForm.code = data.number
        }
      } catch (error) { }
    },
    getuserDepartment(r, s) {
      console.log(r, s)
      this.parentId = s.parentId
      this.dataForm.userDepartmentName = s.organize
    },
    onOrganizeChange(val, data, param) {
      if (!val && data.length) return
      if (!data && !data.length) return
      if (data.length === 0) {
        this.$refs['dataForm'].validateField('categoryName')
      } else {
        console.log(this.$refs['dataForm'], '元素')
        this.$refs['dataForm'].fields[0].resetField('categoryName')

        this.dataForm.productCategoryId = data[0].id
        this.dataForm.categoryName = data[0].name
      }
    },

    // handlerEquChange(value, node) {
    //   console.log(value, node)
    //   if (node) {
    //     this.dataForm.name = node.name
    //     this.dataForm.code = node.code
    //   }
    // },

    init(id, disabled) {
      this.visible = true
      this.dataForm.id = id || ''

      this.disabled = disabled
      if (disabled) {
        this.disabled = disabled
      }
      if (this.dataForm.id) {
        this.fetchData('JYGJ', false)
        getEquEquipmentInfo(this.dataForm.id).then((res) => {
          this.$nextTick(() => {
            this.dataForm = res.data
            if (res.data.attachmentList) {
              res.data.attachmentList.forEach((item) => {
                this.datafilelist.push({
                  name: item.document.fullName,
                  fileSize: item.document.fileSize,
                  filename: item.document.filePath,
                  id: item.document.id,
                  url: item.url
                })
              })
            }
          })
        })
      } else {
        this.fetchData('JYGJ', true)
      }
    },
    goBack() {
      this.$emit('close')
    },

    handleConfirm() {
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.btnLoading = true
          this.dataForm.classAttribute = 'inspect'
          this.dataForm.userName = ''
          this.dataForm.userDepartmentId = this.parentId
          if (this.datafilelist.length) {
            this.datafilelist.map((item, index) => {
              item.bimAttachments = {
                businessType: 'customer',
                documentId: item.id,
                fileFlag: '',
                sort: index
              }
            })
          }
          this.dataForm.attachmentList = this.datafilelist
          const formMethod = this.dataForm.id ? editEquEquipment : saveEquEquipment
          console.log(this.dataForm, '参数')
          formMethod(this.dataForm)
            .then((res) => {
              let msg = ''
              if (formMethod == editEquEquipment) {
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
.main {
  // padding: 10px 30px 0;
}

::v-deep .el-tabs__header {
  padding: 0 !important;
}

.el-button--small {
  // padding: 1;
}

.shuru {
  width: 66.3%;
  height: 100px;
}

.qin {
  position: relative;
}

.qinq {
  position: absolute;
}

::v-deep .el-collapse-item__header {
  line-height: 33px;
  font-size: 18px;
  border-top: 1px solid rgb(220, 223, 230);
  background: rgb(250, 250, 250);
  padding-left: 5px;
  font-weight: 700;
  border-right: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}

::v-deep .el-collapse-item__wrap {
  border: 1px solid #dcdfe6 !important;
  border-top: none;
  margin-bottom: 0;
  padding: 0 10px 0px;
  border-top: none !important;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0px;
}

.JNPF-preview-main .main {
  padding-top: 0;
}

::v-deep .el-tabs__item {
  padding: 0 10px !important;
}

::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0px !important;
}
</style>
