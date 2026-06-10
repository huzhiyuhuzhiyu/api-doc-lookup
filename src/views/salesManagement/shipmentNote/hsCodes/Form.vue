<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "./data";
import {addHsProducts, getHsProducts, updateHsProducts} from "@/api/shipmentNote/hsCodes";

export default {
  name: "Form",
  data() {
    return {
      title: '海关产品分类',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        code: '',
        name: '',
        drawingNo: '',
        tradeName: '',
        purpose: '',
        type: '',
        brand: '',
        remark: '',
      },
      basicFormSchema: getBasicFormSchema(this.$refs.dataForm, this),
      activeName: 'jcInfo',
      activeNames: ['basicInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        copy: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
        },
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  created() {
  },
  methods: {
    async init(id = '', type) {
      this.btnType = type
      this.title = this.getTitle(type)
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
      })
    },

    getTitle(type) {
      switch (type) {
        case 'add':
        case 'copy':
          return `创建${ this.title }`
        case 'edit':
          return `编辑${ this.title }`
        case 'look':
          return `查看${ this.title }`
      }
    },
    async getDetail(id) {
      this.loading = true
      try {
        const res = await getHsProducts(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = data
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async handleSubmit() {
      // 校验表单
      this.btnLoading = true
      const valid_1 = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid_1) return this.btnLoading = false
      const params = deepClone(this.dataForm)
      if (this.btnType === 'copy') params.id = ''
      let MSG = '提交成功'
      try {
        const apiMethod = this.dataForm.id ? updateHsProducts : addHsProducts
        const res = await apiMethod({hsProducts: params})
        const {msg} = res
        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }
        this.btnLoading = false
      } catch (error) {
        this.btnLoading = false
      }
    },

    goBack() {
      this.$emit('close', this.activeType);
    }
  }
}
</script>

<template>
  <transition name="el-zoom-in-center">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header @back="goBack" :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
                    保存并提交
                  </el-button>
                </template>
                <el-button @click="goBack">{{
                    $t('common.cancelButton')
                  }}
                </el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;">
                    <el-collapse-item title="基本信息" name="basicInfo" class="orderInfo" ref="dataFormRegion">
                      <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
                        :btnType="btnType"/>
                    </el-collapse-item>
                  </el-collapse>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
  </transition>
</template>
