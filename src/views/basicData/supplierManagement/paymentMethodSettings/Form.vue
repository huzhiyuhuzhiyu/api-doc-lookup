<script>
import { getBasicFormSchema } from "./data";
import { addPaymentMethod, getPaymentMethod, updatePaymentMethod } from "@/api/paymentMethodSettings";
import { deepClone } from "@/utils";

export default {
  name: "Form",
  data() {
    return {
      title: '付款方式',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {},
      basicFormSchema: [],
      activeName: 'jcInfo',
      activeNames: ['basicInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        copy: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
        },
      },
      apiMethodActions: {
        add: addPaymentMethod,
        copy: addPaymentMethod,
        edit: updatePaymentMethod,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  mounted() {
    this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this)
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
      switch ( type ) {
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
        const res = await getPaymentMethod(id)
        const { msg, data } = res
        if (msg === 'Success') {
          this.dataForm = data
        }
      } catch ( err ) {
        this.loading = false
      } finally {
        this.loading = false
      }
    },

    async handleSubmit() {
      this.btnLoading = true
      try {
        await this.$refs['dataForm'].$refs.main.validate()

        const params = deepClone(this.dataForm)
        if (this.btnType === 'copy') {
          params.id = ''
        }
        let MSG = '提交成功'
        const apiMethod = this.apiMethodActions[this.btnType]
        const res = await apiMethod(params)
        const { msg } = res

        if (msg === 'Success') {
          this.$message.success(MSG)
          this.goBack()
        }

      } catch ( error ) {
        if (error.message) {
          this.$message.error(error.message)
        }
      } finally {
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
    <div class="JNPF-preview-main org-form">
      <div class="JNPF-common-layout">
        <div class="JNPF-common-layout-center JNPF-flex-main">
          <div class="JNPF-preview-main transitionForm org-form">
            <div class="JNPF-common-page-header">
              <el-page-header @back="$emit('close',false)" :content="title"/>
              <div class="options">
                <template v-if="activeType">
                  <el-button type="primary" :loading="btnLoading" @click="handleSubmit">
                    提交
                  </el-button>
                </template>
                <el-button @click="$emit('close',false)">{{
                    $t('common.cancelButton')
                  }}
                </el-button>
              </div>
            </div>
            <div class="main" v-loading="loading" ref="main">
              <el-tabs v-model="activeName">
                <el-tab-pane label="基础信息" name="jcInfo">
                  <el-collapse v-model="activeNames" style="margin-top: 5px;">
                    <el-collapse-item title="基本信息" name="basicInfo" ref="dataFormRegion">
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
    </div>
  </transition>
</template>
