<script>
import {deepClone} from "@/utils";
import {getBasicFormSchema} from "./data";
import {addparametersShelves, editparametersShelves, getparametersInfo} from "@/api/basicData";

export default {
  data() {
    return {
      title: '',
      btnType: '',
      visible: false,
      loading: false,
      btnLoading: false,
      dataForm: {
        code: '',
        name: '',
        typeCode: '',
        itemRequirements: '',
        inspectionMethod: '',
        remark: '',
      },
      basicFormSchema: getBasicFormSchema(this.$refs.dataForm, this),
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
  methods: {
    async init(id = '', type, typeCode, classAttribute) {
      this.visible = true
      this.btnType = type
      this.dataForm.typeCode = typeCode
      this.dataForm.classAttribute = classAttribute
      this.title = this.getTitle(type, typeCode);
      if (id && this.actions[type]) {
        await this.actions[type](id);
      } else {
        await this.actions.default();
      }
      this.$nextTick(() => {
        this.$refs.dataForm.$refs.main.clearValidate()
      })
    },

    getTitle(type, typeCode) {
      const typeNames = {
        faultType: '故障类型',
        faultLocation: '故障部位',
        maintenanceItem: '保养项目',
        inspectionItem: '点检项目'
      };
      const typeName = typeNames[typeCode] || '';
      switch (type) {
        case 'add':
        case 'copy':
          return `创建${ typeName }`;
        case 'edit':
          return `编辑${ typeName }`;
        case 'look':
          return `查看${ typeName }`;
        default:
          return typeName;
      }
    },

    async getDetail(id) {
      this.loading = true
      try {
        const res = await getparametersInfo(id)
        const {msg, data} = res
        if (msg === 'Success') {
          this.dataForm = _.merge(this.dataForm, data)
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async handleSubmit() {
      // 校验表单
      this.btnLoading = true
      const valid = await this.$refs['dataForm'].$refs.main.validate().catch(err => false)
      if (!valid) return this.btnLoading = false
      const params = {
        parameters: deepClone(this.dataForm)
      }
      let MSG = '提交成功'
      try {
        const apiMethod = this.dataForm.id ? editparametersShelves : addparametersShelves
        const res = await apiMethod(params)
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
      this.visible = false
      this.$emit('close');
    }
  }
}
</script>

<template>
  <el-dialog :title="title"
    :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="visible" lock-scroll v-if="visible"
    class="JNPF-dialog JNPF-dialog_center" width="600px">
    <JNPF-col v-model="dataForm" :tabContent="basicFormSchema" ref="dataForm"
      :btnType="btnType"/>
    <template slot="footer" class="dialog-footer" v-if="activeType">
      <el-button @click="goBack">{{ $t('common.cancelButton') }}</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleSubmit()">
        提交
      </el-button>
    </template>
  </el-dialog>
</template>

