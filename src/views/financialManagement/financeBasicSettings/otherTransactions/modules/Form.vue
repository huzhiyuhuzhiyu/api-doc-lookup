<script>
import { getBasicFormSchema } from "../data";
import { addOtherTransactions, getOtherTransactions, updateOtherTransactions } from "@/api/otherTransactions";
import { deepClone } from "@/utils";

export default {
  name: "Form",
  props: {
    paymentType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      title: '其他',
      btnType: '',
      loading: false,
      btnLoading: false,
      dataForm: {
        paymentType: '',
        paymentDate: ''
      },
      basicFormSchema: [],
      activeName: 'jcInfo',
      activeNames: ['basicInfo'],
      actions: {
        edit: async (id) => {
          await this.getDetail(id);
        },
        look: async (id) => {
          await this.getDetail(id);
        },
        default: async () => {
        },
      },
      apiMethodActions: {
        add: addOtherTransactions,
        edit: updateOtherTransactions,
      }
    }
  },
  computed: {
    activeType() {
      return this.btnType !== 'look'
    },
  },
  methods: {
    async init(id = '', type, paymentType) {
      const paymentTypeLabel = paymentType === 'pay' ? '付款' : '收款'
      this.btnType = type
      this.title = this.getTitle(type, paymentTypeLabel)
      this.dataForm.paymentType = paymentType
      this.dataForm.paymentDate = this.jnpf.getToday()
      this.basicFormSchema = getBasicFormSchema(this.$refs.dataForm, this, paymentTypeLabel)
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
      })
    },

    getTitle(type, paymentTypeLabel) {
      switch ( type ) {
        case 'add':
          return `创建${ paymentTypeLabel }${ this.title }`
        case 'edit':
          return `编辑${ paymentTypeLabel }${ this.title }`
        case 'look':
          return `查看${ paymentTypeLabel }${ this.title }`
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getOtherTransactions(id)
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
    </div>
  </transition>
</template>
