<template>
  <el-drawer :title="!dataForm.id ? '新建产品分类' : '编辑产品分类'" :close-on-click-modal="false" :close-on-press-escape="false"
    :visible.sync="visible" lock-scroll width="500px" @close="$emit('close')" class="JNPF-common-drawer">
    <template slot="title">
      <div class="custom_title">
        {{ title }}
      </div>
    </template>
    <div style="padding:10px">
      <el-form ref="dataForm" v-loading="formLoading" :model="dataForm" :type="dataForm.type" :rules="dataRule"
        label-position="top" label-width="120px" hide-required-asterisk="fasle">
        <el-form-item label="上级分类" prop="parentName">
          <ComSelect-list :isdisabled="dataForm.id ? true : false" v-model="dataForm.parentName" placeholder="请选择上级分类"
            auth @change="onOrganizeChange" :title="'选择上级分类'" :method="getcategoryTree" :requestObj="requestObjTwo"
            :paramsObj="{}" />
        </el-form-item>
        <el-form-item label="类别属性" prop="classAttribute" v-if="!dataForm.parentName">
          <el-select v-model="dataForm.classAttribute" placeholder="请选择类别属性" clearable style="width: 100%;"
            :disabled="dataForm.id ? true : false">
            <el-option v-for="(item, index) in categoryPropertList" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <template slot="label">
            分类名称
            <span class="required">*</span>
          </template>
          <el-input v-model="dataForm.name" placeholder="请输入分类名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <template slot="label">
            分类编码
            <span class="required">*</span>
          </template>
          <el-input v-model="dataForm.code" placeholder="请输入分类编码" maxlength="20" />
        </el-form-item>
        <el-form-item label="类型" prop="classType">
          <el-select v-model="dataForm.classType" placeholder="请选择类型" clearable style="width: 100%;">
            <el-option v-for="(item, index) in classTypelist" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" type="textarea" maxlength="200" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <span class="button-bottom">
        <el-button @click="$emit('close')">{{ $t('common.cancelButton') }}</el-button>
        <el-button type="primary" :loading="btnLoading" @click="dataFormSubmit()">
          {{ $t('common.submitButton') }}
        </el-button>
      </span>
    </div>
  </el-drawer>
</template>

<script>
import {
  detailCategory,
  updateCategory,
  addCategory,
  checkCategoryCode,
  getcategoryTree
} from '@/api/basicData/materialSettings'
import { getclassAttributeList } from '@/api/masterDataManagement/index'
export default {
  data() {
    return {
      requestObjTwo: {
        pageSize: -1,
        classAttribute: ''
      },
      title: '',
      getcategoryTree,
      visible: false,
      formLoading: false,
      btnLoading: false,
      dataForm: {
        parentId: '',
        parentName: '',
        classType: '',
        code: '',
        name: '',
        remark: '',
        classAttribute: ''
      },
      categoryPropertList: [
        {
          label: '原材料',
          value: 'raw_material'
        },
        {
          label: '半成品',
          value: 'semi_finished'
        },
        {
          label: '成品',
          value: 'finish_product'
        },
        {
          label: '辅料',
          value: 'accessories'
        }
      ],
      autoCode: '',
      dataRule: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入分类编码', trigger: 'blur' },
          { validator: this.formValidate('enCode'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
              } else if (value === this.autoCode) {
                callback()
              } else {
                checkCategoryCode({
                  code: value,
                  parentId: this.dataForm.parentId,
                  classAttribute: this.dataForm.classAttribute
                })
                  .then((res) => {
                    if (!res.data) {
                      callback()
                    } else {
                      callback(new Error('此分类编码已存在'))
                    }
                  })
                  .catch((err) => {
                    callback(new Error(' '))
                  })
              }
            },
            trigger: 'blur'
          }
        ]
      },
      classTypelist: [
        { label: '包装物', value: 'packaging' },
        { label: '内圈毛坯', value: 'inner_ring_blank' },
        { label: '外协毛坯', value: 'outer_ring_blank' }
      ]
    }
  },
  created() {
    this.getclassAttributeList()
  },
  methods: {
    getclassAttributeList() {
      let obj = {
        pageNum: 1,
        pageSize: -1
      }
      getclassAttributeList(obj).then((res) => {
        this.categoryPropertList = res.data.records.map((item) => {
          return {
            label: item.name,
            value: item.code
          }
        })
      })
    },
    init(id, parentId, btntype) {
      this.visible = true
      this.dataForm.id = id || ''
      this.dataForm.parentId = parentId || '-1'
      this.formLoading = true
      this.$nextTick(() => {
        if (btntype == 'edit') {
          detailCategory(this.dataForm.id).then((res) => {
            this.dataForm = res.data
            this.autoCode = res.data.code
            this.title = '编辑产品分类'
            this.formLoading = false
          })
        } else if (btntype == 'copy') {
          detailCategory(this.dataForm.id).then((res) => {
            this.dataForm = res.data
            this.autoCode = res.data.code
            this.title = '新建产品分类'
            delete this.dataForm.id //true
            this.formLoading = false
          })
        } else if (btntype == 'add') {
          this.title = '新建产品分类'
          this.formLoading = false
        }
      })
    },
    onOrganizeChange(val, data) {
      if (!data) {
        this.dataForm.parentId = ''
        this.dataForm.parentName = ''
      } else {
        this.dataForm.parentId = data[0].id
        this.dataForm.parentName = data[0].name
        this.dataForm.classAttribute = data[0].all.classAttribute
      }
    },
    async dataFormSubmit() {
      let valid = await this.$refs['dataForm'].validate().catch((err) => false)
      this.btnLoading = true
      if (valid) {
        if (!this.dataForm.parentId) this.dataForm.parentId = '-1'
        let formMethod = this.dataForm.id ? updateCategory : addCategory
        formMethod(this.dataForm)
          .then((res) => {
            this.$emit('close', true)
            this.$message({
              message: this.dataForm.id ? '修改成功' : '新建成功',
              type: 'success',
              duration: 1500
            })
          })
          .catch(() => {
            this.btnLoading = false
          })
      } else {
        this.btnLoading = false
      }
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
